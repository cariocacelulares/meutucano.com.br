<?php namespace Modules\Core\Http\Controllers\Relatorio;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use NFePHP\Extras\Danfe;
use App\Http\Controllers\Rest\RestControllerTrait;
use Modules\Core\Models\Pedido\Nota;

/**
 * Class ICMSController
 * @package Modules\Core\Http\Controllers\Relatorio
 */
class ICMSController extends Controller
{
    use RestControllerTrait;

    protected $validationRules = [];

    /**
     * Return relatório ICMS
     */
    public function icms()
    {
        $notas = Nota::with(['pedido', 'pedido.imposto', 'pedido.endereco'])
            ->where(DB::raw('MONTH(pedido_notas.data)'), '=', date("m", strtotime("-1 month")))
            ->where(DB::raw('YEAR(pedido_notas.data)'), '=', date('Y'))
            ->get();

        $relatorio[] = 'OPERACAO;TIPO;NUMERO;UFREM;ICMSREM;UFDEST;ICMSDEST;TOTAL';
        $relatorio[] = "\r\n";
        foreach ($notas as $nota) {
            $relatorio[] = $nota->pedido->operacao . ';';
            $relatorio[] = ((in_array($nota->pedido->operacao, \Config::get('tucano.notas.operacoes'))) ? 'VENDA' : 'DEVOLUCAO') . ';';
            $relatorio[] = $nota->numero . ';';
            $relatorio[] = \Config::get('tucano.uf'). ';';
            $relatorio[] = 'R$' . (count($nota->pedido->imposto) ? number_format($nota->pedido->imposto->icms_remetente, 2, ',', '.') : '0,00') . ';';
            $relatorio[] = $nota->pedido->endereco->uf . ';';
            $relatorio[] = 'R$' . (count($nota->pedido->imposto) ? number_format($nota->pedido->imposto->icms_destinatario, 2, ',', '.') : '0,00') . ';';
            $relatorio[] = 'R$' . number_format(abs($nota->pedido->total), 2, ',', '.');
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
