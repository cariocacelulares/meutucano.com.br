<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Pedido;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;
use App\Http\Controllers\Integracao\SkyhubController;
use App\Http\Controllers\Integracao\MagentoController;
use Illuminate\Support\Facades\DB;

/**
 * Class PedidoController
 * @package App\Http\Controllers\Pedido
 */
class PedidoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Pedido::class;

    protected $validationRules = [];

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::with(['cliente', 'endereco'])
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->leftJoin('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Lista pedidos prontos para serem faturados
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function faturamento() {
        $m = self::MODEL;

        $list = $m::with([
                'cliente',
                'endereco',
                'notas',
                'rastreios',
                'comentarios'
            ])
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->leftJoin('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
            ->where('status', '=', 1)
            ->groupBy('pedidos.id')
            ->orderBy('priorizado', 'DESC')
            ->orderBy('estimated_delivery', 'ASC')
            ->orderBy('created_at', 'ASC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Adiciona ou remove prioridade de um pedido
     * @param  int $pedido_id
     * @return Pedido
     */
    public function prioridade($pedido_id)
    {
        $m = self::MODEL;

        try {
            $prioridade = Input::get('priorizado');
            $prioridade = (int)$prioridade ? 1 : null;

            $pedido = $m::find($pedido_id);
            $pedido->priorizado = $prioridade;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Segura ou libera um pedido
     * @param  int $pedido_id
     * @return Pedido
     */
    public function segurar($pedido_id)
    {
        $m = self::MODEL;

        try {
            $segurar = Input::get('segurar');
            $segurar = (int)$segurar ? 1 : 0;

            $pedido = $m::find($pedido_id);
            $pedido->segurado = $segurar;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Altera status do pedido e adiciona o protocolo
     *
     * @param  Pedido $pedido_id
     * @param  int $protocolo
     * @return Pedido
     */
    public function alterarStatus($pedido_id) {
        $m = self::MODEL;

        try {
            $status = \Request::get('status');

            if (!$status && $status !== 0) {
                throw new \Exception('"status" parameter not found!', 1);
            }

            $data = $m::find($pedido_id);

            $protocolo = \Request::get('protocolo');
            if ($protocolo) {
                $data->protocolo = $protocolo;
            }

            $data->status = $status;
            $data->save();

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;

        try {
            $data = $m::with([
                'cliente',
                'endereco',
                'notas',
                'rastreios',
                'produtos',
                'comentarios',
                'rastreios.devolucao',
                'rastreios.pi',
                'rastreios.logistica'
            ])->find($id);

            if ($data) {
                return $this->showResponse($data);
            }
        } catch (\Exception $e) {
            if ($e->getPrevious())
                throw $e->getPrevious();
            else
                throw $e;
        }

        return $this->notFoundResponse();
    }

    /**
     * Cancela pedidos com mais de x dias úteis de pagamento pendente
     *
     * @return void
     */
    public static function cancelOldOrders()
    {
        $pedidos = Pedido::where('status', '=', 0)->whereNotNull('codigo_api')->get();

        foreach ($pedidos as $pedido) {
            try {
                $dataPedido = Carbon::createFromFormat('d/m/Y H:i', $pedido->created_at)->format('d/m/Y');
                $diasUteis = diasUteisPeriodo($dataPedido, date('d/m/Y'), true);

                if (
                    (strtolower($pedido->marketplace) == 'site' && $diasUteis > \Config::get('tucano.magento.old_order'))
                    ||
                    (strtolower($pedido->marketplace) != 'site' && $diasUteis > \Config::get('tucano.skyhub.old_order'))
                    ) {
                    $pedido->status = 5;
                    $pedido->save();
                }
            } catch (\Exception $e) {
                \Log::error(logMessage($e, 'Não foi possível cancelar o pedido na Integração'));
            }
        }
    }

    /**
     * Envia informações de entrega e nota para o Magento / Skyhub
     *
     * @param  int $pedido_id
     * @return void
     */
    public function faturar($pedido_id)
    {
        if ($pedido = Pedido::find($pedido_id)) {
            $pedido->status = 2;

            if (strtolower($pedido->marketplace) == 'site') {
                (new MagentoController())->orderInvoice($pedido);
            } else {
                (new SkyhubController())->orderInvoice($pedido);
            }
        }
    }

    public function grafico()
    {
        $ano = date('Y');
        $mes = date('m');
        $dia = date('d');
        $inicioMes = "{$ano}-{$mes}-01 00:00:00";

        /*$list = [
            'pendente'  => Pedido::selectRaw('DAY(created_at) as date, COUNT(*) as count')->where('status', '=', 0)->where('created_at', '>=', $inicioMes)->groupBy(DB::raw('DAY(created_at)'))->orderBy(DB::raw('DAY(created_at)'), 'ASC')->lists('count', 'date'),
            'pago'         => Pedido::selectRaw('DAY(created_at) as date, COUNT(*) as count')->where('status', '=', 1)->where('created_at', '>=', $inicioMes)->groupBy(DB::raw('DAY(created_at)'))->orderBy(DB::raw('DAY(created_at)'), 'ASC')->lists('count', 'date'),
            'enviado'     => Pedido::selectRaw('DAY(created_at) as date, COUNT(*) as count')->where('status', '=', 2)->where('created_at', '>=', $inicioMes)->groupBy(DB::raw('DAY(created_at)'))->orderBy(DB::raw('DAY(created_at)'), 'ASC')->lists('count', 'date'),
            'entregue'   => Pedido::selectRaw('DAY(created_at) as date, COUNT(*) as count')->where('status', '=', 3)->where('created_at', '>=', $inicioMes)->groupBy(DB::raw('DAY(created_at)'))->orderBy(DB::raw('DAY(created_at)'), 'ASC')->lists('count', 'date'),
            'cancelado' => Pedido::selectRaw('DAY(created_at) as date, COUNT(*) as count')->where('status', '=', 5)->where('created_at', '>=', $inicioMes)->groupBy(DB::raw('DAY(created_at)'))->orderBy(DB::raw('DAY(created_at)'), 'ASC')->lists('count', 'date'),
        ];

        foreach ($list as $key => $value) {
            $aux = [];
            for ($day=1; $day <= $dia; $day++) {
                // $aux[] = (isset($value[$day])) ? $value[$day] : 0;
                $aux[] = [$day, (isset($value[$day])) ? $value[$day] : 0];
            }
            $list[$key] = $aux;
        }

        $list['ano'] = Pedido::where('created_at', 'LIKE', $ano . '-%')->orderBy('created_at', 'DESC')->count();
        $list['mes'] = Pedido::where('created_at', 'LIKE', "{$ano}-{$mes}-%")->orderBy('created_at', 'DESC')->count();
        $list['dia'] = Pedido::where('created_at', 'LIKE', "{$ano}-{$mes}-{$dia}%")->orderBy('created_at', 'DESC')->count();*/

        $marketplaces = Pedido::selectRaw('DISTINCT(marketplace) marketplace')->where('created_at', '>=', $inicioMes)->orderBy('marketplace', 'ASC')->lists('marketplace');
        $marketplacesNames = $marketplaces;
        $aux = [];
        foreach ($marketplaces as $key => $marketplace) {
            $aux[$marketplace] = 0;
        }
        $marketplaces = $aux;
        unset($aux);

        $list = [
            'pendente'  => Pedido::selectRaw('marketplace, COUNT(*) as count')->where('status', '=', 0)->where('created_at', '>=', $inicioMes)->groupBy('marketplace')->orderBy('marketplace', 'ASC')->lists('count', 'marketplace'),
            'pago'         => Pedido::selectRaw('marketplace, COUNT(*) as count')->where('status', '=', 1)->where('created_at', '>=', $inicioMes)->groupBy('marketplace')->orderBy('marketplace', 'ASC')->lists('count', 'marketplace'),
            'enviado'     => Pedido::selectRaw('marketplace, COUNT(*) as count')->where('status', '=', 2)->where('created_at', '>=', $inicioMes)->groupBy('marketplace')->orderBy('marketplace', 'ASC')->lists('count', 'marketplace'),
            'entregue'   => Pedido::selectRaw('marketplace, COUNT(*) as count')->where('status', '=', 3)->where('created_at', '>=', $inicioMes)->groupBy('marketplace')->orderBy('marketplace', 'ASC')->lists('count', 'marketplace'),
            'cancelado' => Pedido::selectRaw('marketplace, COUNT(*) as count')->where('status', '=', 5)->where('created_at', '>=', $inicioMes)->groupBy('marketplace')->orderBy('marketplace', 'ASC')->lists('count', 'marketplace'),
        ];

        foreach ($list as $key => $value) {
            $aux = [];

            foreach ($value as $mkt => $qtd) {
                $aux[$mkt] = $qtd;
            }
            $list[$key] = array_values(array_merge($marketplaces, $aux));
        }

        $list['marketplaces'] = $marketplacesNames;

        return $this->listResponse($list);
    }
}