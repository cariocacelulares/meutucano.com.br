<?php namespace App\Http\Controllers\Meta;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\MetaMes;
use App\Models\MetaAno;
use App\Models\Pedido;
use App\Models\PedidoProduto;
use App\Models\Produto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class MetaController extends Controller
{
    use RestResponseTrait;

    /**
     * Return information about current meta
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getAtual()
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

            $mes = PedidoProduto::autoJoin('inner', Pedido::class, 'pedido', 'pedido_id')
                ->autoJoin('inner', Produto::class, 'produto', 'produto_sku')
                ->select(DB::raw(
                    'sum(pedido_produtos.valor * pedido_produtos.quantidade * IF (pedido.total >= 0, 1, -1)) AS total'
                ))
                ->where(DB::raw('MONTH(pedido.created_at)'), '=', date('n'));

            /**
             * Calcula os valores até agora
             */
            $atualAno            = Pedido::where(DB::raw('MONTH(created_at)'), '=', date('n'))->sum('total');
            $atualMesSmartphones = with(clone($mes))->where('produto.ncm', '85171231')->first('total');
            $atualMesOutros      = with(clone($mes))->where('produto.ncm', '<>' , '85171231')->first('total');

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
            return $this->notFoundResponse();
        }
    }
}