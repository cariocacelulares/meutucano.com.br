<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoNota;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use NFePHP\Extras\Danfe;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class RelatorioController
 * @package App\Http\Controllers\Admin
 */
class RelatorioController extends Controller
{
    use RestControllerTrait;

    protected $validationRules = [];

    /**
     * Return relatório ICMS
     */
    public function icms()
    {
        $notas = PedidoNota::with(['pedido', 'pedido.imposto', 'pedido.endereco'])
            ->where(DB::raw('MONTH(pedido_notas.data)'), '=', date('n', strtotime("-1 month")))
            ->where(DB::raw('YEAR(pedido_notas.data)'), '=', date('Y'))
            ->get();

        $relatorio[] = 'OPERACAO;TIPO;NUMERO;UFREM;ICMSREM;UFDEST;ICMSDEST;TOTAL';
        $relatorio[] = "\r\n";
        foreach ($notas as $nota) {
            $relatorio[] = $nota->pedido->operacao . ';';
            $relatorio[] = ((in_array($nota->pedido->operacao, \Config::get('tucano.operacoes'))) ? 'VENDA' : 'DEVOLUCAO') . ';';
            $relatorio[] = $nota->numero . ';';
            $relatorio[] = \Config::get('tucano.uf'). ';';
            $relatorio[] = 'R$' . (count($nota->pedido->imposto) ? $nota->pedido->imposto->icms_remetente : '0,00') . ';';
            $relatorio[] = $nota->pedido->endereco->uf . ';';
            $relatorio[] = 'R$' . (count($nota->pedido->imposto) ? $nota->pedido->imposto->icms_destinatario : '0,00') . ';';
            $relatorio[] = 'R$' . abs($nota->pedido->total);
            $relatorio[] = "\r\n";
        }

        $output = implode('', $relatorio);

        $headers = array(
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="icms.csv"',
        );

        return response()->make(rtrim($output, "\n"), 200, $headers);
    }
}
