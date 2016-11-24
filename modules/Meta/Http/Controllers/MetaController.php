<?php namespace Modules\Meta\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestResponseTrait;
use Modules\Core\Models\Pedido\Pedido;
use Modules\Core\Models\Pedido\PedidoProduto;
use Modules\Meta\Models\MetaMes;
use Modules\Meta\Models\MetaAno;

class MetaController extends Controller
{
    use RestResponseTrait;

    /**
     * Return information about current meta
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function atual()
    {
        try {
            $ano = Input::get('ano', date('Y'));
            $mes = Input::get('mes', date('m'));

            /**
             * Busca as metas
             */
            $metaAno            = MetaAno::where(['ano' => $ano])->first();
            $metaMesSmartphones = MetaMes::where(['ano'  => $ano, 'mes'  => $mes, 'tipo' => 0])->first();
            $metaMesOutros      = MetaMes::where(['ano'  => $ano, 'mes'  => $mes, 'tipo' => 1])->first();

            $mes = PedidoProduto::join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
                ->join('produtos', 'produtos.sku', '=', 'pedido_produtos.produto_sku')
                ->join('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
                ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
                ->select(DB::raw(
                    'sum(pedido_produtos.valor * pedido_produtos.quantidade * IF (pedidos.total >= 0, 1, -1)) AS total'
                ))
                ->whereNotIn('clientes.taxvat', \Config::get('tucano.excluir_cnpj'))
                ->whereNull('pedidos.deleted_at')
                ->where(DB::raw('MONTH(pedido_notas.data)'), '=', date('n'))
                ->where(DB::raw('YEAR(pedido_notas.data)'), '=', date('Y'));

            /**
             * Calcula os valores até agora
             */
             $atualAno = Pedido::join('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
                 ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
                 ->whereNotIn('clientes.taxvat', \Config::get('tucano.excluir_cnpj'))
                 ->where(DB::raw('YEAR(pedido_notas.data)'), '=', date('Y'))->sum('total');

            $atualMesSmartphones = with(clone($mes))->where('produtos.ncm', '85171231')->first('total');
            $atualMesOutros      = with(clone($mes))->where('produtos.ncm', '<>' , '85171231')->first('total');

            /**
             * Dias úteis
             */
            $diasUteisTotalAno = diasUteisPeriodo(date('01/01/Y'), date('t/12/Y'), true);
            $diasUteisTotalMes = diasUteisPeriodo(date('01/m/Y'), date('t/m/Y'), true);

            $diasUteisAteAgoraAno = diasUteisPeriodo(date('01/01/Y'), date('d/m/Y'), true);
            $diasUteisAteAgoraMes = diasUteisPeriodo(date('01/m/Y'), date('d/m/Y'), true);

            /**
             * Percentuais
             */
            $response = [];
            if ($metaAno) {
                $metaAteAgoraAno  = ($metaAno['valor'] / $diasUteisTotalAno) * $diasUteisAteAgoraAno;
                $diferencaMetaAno = $atualAno - $metaAteAgoraAno;

                $response['ano'] = [
                    'percentual' => number_format(($atualAno / $metaAno['valor']) * 100, 2, '.', ','),
                    'diferenca'  => number_format(($diferencaMetaAno / $metaAno['valor']) * 100, 2, '.', ',')
                ];
            }

            if ($metaMesSmartphones) {
                $metaAteAgoraMesSmartphones  = ($metaMesSmartphones['valor'] / $diasUteisTotalMes) * $diasUteisAteAgoraMes;
                $diferencaMetaMesSmartphones = $atualMesSmartphones['total'] - $metaAteAgoraMesSmartphones;

                $response['mes']['smartphones'] = [
                    'percentual' => number_format(($atualMesSmartphones['total'] / $metaMesSmartphones['valor']) * 100, 2, '.', ','),
                    'diferenca'  => number_format(($diferencaMetaMesSmartphones / $metaMesSmartphones['valor']) * 100, 2, '.', ',')
                ];
            }

            if ($metaMesOutros) {
                $metaAteAgoraMesOutros  = ($metaMesOutros['valor'] / $diasUteisTotalMes) * $diasUteisAteAgoraMes;
                $diferencaMetaMesOutros = $atualMesOutros['total'] - $metaAteAgoraMesOutros;

                $response['mes']['outros'] = [
                    'percentual' => number_format(($atualMesOutros['total'] / $metaMesOutros['valor']) * 100, 2, '.', ','),
                    'diferenca'  => number_format(($diferencaMetaMesOutros / $metaMesOutros['valor']) * 100, 2, '.', ',')
                ];
            }

            return $this->showResponse($response);
        } catch (\Exception $e) {
            echo $e->getMessage() . $e->getLine();
            return $this->notFoundResponse();
        }
    }
}