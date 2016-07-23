<?php namespace App\Http\Controllers;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\PedidoNota;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use App\Models\Produto;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

/**
 * Class SearchController
 * @package App\Http\Controllers
 */
class SearchController extends Controller
{
    use RestResponseTrait;

    public function imei() 
    {
        $imeiBusca = [
            '352013070136749',
            '352016070066030',
            '352013070141228',
            '352013070136525',
            '352019070196070',
            '352013070103772',
            '352019070169945',
            '352019070195395',
            '352013070141327',
            '352013070141533',
            '352013070174625',
            '352016070033568',
            '352013070173460',
            '352013070136657',
            '352019070229293',
            '352019070196161',
            '352019070196187',
            '352013070141491',
            '352013070136293',
            '352016070033501',
            '359302069406046',
            '352013070159337',
            '359307068301932',
            '359296066438665',
            '359296066791584',
            '359296066791584',
            '359302063630039',
            '359296066791485',
            '359302063402363',
            '359296067199027',
            '359296066809097',
            '359296065602725',
            '359302063402330',
            '359302063630666',
            '359296065602899',
            '359302063630237',
            '359296065989676',
            '359296065990112',
            '359307068101720',
            '352018070012048',
            '355795071265942',
            '355795070648346',
            '355795070767211',
            '355795071341594',
            '355795070143181',
            '355795071262824',
            '355795070141532',
            '355795070140831',
            '355795070703562',
            '355795070758343',
            '355795070241639',
        ];
        $imei = array_merge([], $imeiBusca);

        set_time_limit(0);

        $remove = [];
        $achou  = [];
        $files = glob(storage_path('app/public/nota/*.xml'));
        foreach ($files as $nota) {
            $output = file_get_contents($nota);
            if (substr($output, 0, 5) !== '<?xml')
                continue;

            $xml = simplexml_load_string($output);

            $nfe = $xml->NFe->infNFe;

            if (!is_object($nfe))
                continue;
            
            if ($nfe->emit->CNPJ != '14619408000150')
                continue;

            $find     = false;
            $uf       = null;
            $idPedido = null;
            $buscaI   = null;
            foreach ($imei as $busca) {
                if (!property_exists($nfe, 'infAdic'))
                    break;

                if (strpos(strtoupper($nfe->infAdic->infCpl), $busca) !== false) {
                    $chave = $xml->protNFe->infProt->chNFe;
                    $idPedido = (int) substr($chave, 25, 10);
                    $achou[$busca]  = $busca . ';' . $nfe->dest->enderDest->UF . ';' . $idPedido . '<br>';
                    unset($imei[array_search($busca, $imei)]);

                    // break;
                 }
            }

            // break;
        }

        foreach ($imeiBusca as $teste) {
            if (array_key_exists($teste, $achou)) {
                echo $achou[$teste];
            } else {
                echo $teste . '<br>';
            }
        }

        // echo implode('', array_reverse($achou));
        print_r($imei);
    }

    public function devolucao()
    {
        $devolucoes = [
            '146011',
            '146041',
            '146051',
            '146671',
            '146681',
            '146691',
            '146701',
            '146711',
            '146721',
            '146731',
            '146751',
            '146771',
            '146791',
            '146811',
            '146861',
            '147221',
            '147251',
            '147261',
            '147271',
            '147981',
            '148721',
            '148741',
            '148751',
            '148761',
            '148791',
            '148801',
            '149351',
            '149961',
            '150741',
            '150851',
            '152051',
            '152211',
            '152221',
            '152231',
            '152241',
            '152251',
            '152261',
            '152271',
            '152281',
            '152601',
            '152641',
            '152991',
            '153061',
            '153071',
            '153081',
            '153101',
            '153121',
            '153131',
            '153151',
            '153161',
            '153251',
            '153391',
            '153401',
            '153551',
            '153601',
            '153621',
            '153631',
            '153671',
            '153751',
            '153871',
            '153901',
            '153921',
            '154031',
            '158811',
            '158841',
            '158851',
            '158871',
            '158881',
            '158911',
            '158941',
            '158951',
            '158971',
            '158991',
            '159221',
            '159541',
            '159831',
            '159841',
            '159891',
            '160651',
            '161791',
            '162621',
            '162711',
            '163281',
            '163501',
            '163511',
            '164851',
            '166391',
            '166511',
            '166541',
            '166891',
            '167301',
            '167311',
            '167321',
            '167771',
            '167781',
            '167791',
            '167801',
            '167811',
            '167971',
            '167981',
            '167991',
            '168001',
            '169711',
            '170861',
            '170871',
            '170941',
            '170971',
            '171021',
            '171081',
            '172771',
            '172781',
            '172791',
            '172801',
            '173161',
            '173191',
            '173221',
            '173251',
            '173271',
            '174471',
            '174561',
            '176141',
            '176181',
            '176201',
            '176231',
            '176261',
            '176281',
            '177751',
            '180181',
            '180271',
            '180301',
            '180361',
            '180411',
            '180471',
            '180531',
            '180561',
            '180581',
            '180591',
            '180601',
            '180611',
            '180621',
            '180711',
            '181351',
            '181391',
            '181411',
            '181861',
            '181891',
            '182491',
            '182511',
            '182531',
            '182571',
            '182581',
            '182731',
            '183561',
            '183571',
            '183581',
            '183591',
            '183601',
            '183661',
            '183841',
            '184641',
            '184661',
            '184671',
            '184711',
            '184721',
            '184731',
            '184931',
            '184951',
            '184961',
            '184981',
            '184991',
            '185031',
            '185631',
            '185761',
            '185821',
            '186111',
            '186221',
            '186231',
            '186251',
            '186261',
            '186271',
            '186281',
            '186291',
            '186301',
            '186681',
            '186691',
            '186711',
            '186731',
            '186741',
            '186751',
            '186761',
            '186781',
            '186791',
            '186801',
            '186891',
            '186931',
            '186941',
            '186991',
            '187001',
            '187031',
            '188321',
            '188331',
            '188341',
            '188351',
            '188361',
            '188371',
            '188381',
            '188391',
            '188401',
            '188411',
            '188421',
            '188431',
            '188441',
            '188451',
            '188461',
            '188471',
            '188481',
            '188491',
            '188501',
            '188511',
            '190021',
            '190031',
            '190971',
            '190981',
            '190991',
            '191651',
            '193591',
            '193631',
            '193711',
            '194041',
            '196731',
            '196771',
            '196911',
            '196941',
            '196951',
            '196971',
            '197021',
            '197041',
            '197051',
            '197771',
            '197811',
            '198061',
            '198781',
            '199381',
            '199391',
            '199951',
            '200071',
            '200411',
            '200431',
            '200441',
            '200511',
            '200521',
            '200871',
            '200981',
            '201011',
            '201021',
            '201031',
            '201051',
            '201091',
            '201121',
            '201131',
            '201391',
            '201471',
            '201511',
            '201681',
            '201691',
            '201701',
            '201711',
            '201721',
            '201741',
            '201751',
            '201761',
            '202161',
            '203181',
            '203401',
            '203441',
            '203451',
            '203811',
            '205581',
            '205601',
            '205621',
            '205631',
            '205641',
            '205651',
            '206991',
            '207001',
            '207011',
            '207021',
            '207031',
            '207041',
            '207051',
            '207431',
            '207441',
            '207451',
            '207461',
            '207471',
            '207481',
            '207491',
            '207501',
            '208051',
            '208921',
            '208931',
            '208941',
            '208951',
            '208961',
            '208971',
            '208981',
            '208991',
            '209001',
            '209011',
            '210211',
            '211411',
            '211421',
            '211431',
            '211441',
            '211451',
            '211471',
            '211481',
            '211491',
            '211501',
            '211521',
            '211531',
            '211711',
            '212381',
            '212481',
            '212671',
            '212681',
            '212691',
            '212701',
            '212711',
            '212721',
            '212731',
            '212741',
            '212751',
            '212761',
            '212771',
            '212781',
            '212801',
            '212811',
            '213291',
            '213411',
            '213781',
            '213791',
            '213801',
            '213821',
            '213831',
            '213841',
            '213851',
            '213871',
            '213961',
            '214071',
            '214381',
            '214401',
            '214431',
            '214691',
            '214701',
            '214721',
            '215241',
            '215381',
            '215991',
            '216521',
            '216531',
            '216541',
            '216551',
            '216561',
            '216581',
            '219931',
            '219941',
            '219951',
            '219961',
            '219971',
            '219981',
            '219991',
            '220001',
            '220631',
            '220641',
            '220661',
            '220671',
            '220681',
            '223691',
            '223941',
            '223951',
            '224171',
            '224751',
            '224761',
            '224771',
            '224781',
            '224791',
            '224821',
            '225371',
            '225381',
            '225401',
            '226541',
            '226561',
            '226571',
            '226581',
            '226591',
            '226601',
            '226611',
            '226621',
            '226631',
            '226641',
            '226651',
            '226661',
            '226671',
            '226721',
            '226731',
            '226741',
            '229181',
            '229191',
            '229201',
            '229211',
            '229221',
            '229231',
            '229241',
            '229251',
            '229261',
            '229271',
            '229281',
            '229291',
            '229301',
            '229311',
            '229321',
            '232761',
            '232771',
            '232781',
            '232801',
            '232811',
            '236251',
            '236271',
            '241471',
            '241651',
            '241661',
            '242391',
            '242801',
            '242811',
            '242841',
            '242851',
            '242861',
            '242871',
            '242881',
            '242891'
        ];

        foreach ($devolucoes as $dev) {
            $arquivo = glob(storage_path('app/public/nota/*14619408000150550010000') . $dev . '*.xml');
            if (sizeof($arquivo) == 0)
                continue;
            
            $output = file_get_contents($arquivo[0]);
            preg_match('/Referente a Nota Fiscal:\ ?[0-9]{4,5}/', $output, $notaVenda);

            $pedido = Pedido::with(['nota', 'produtos', 'endereco'])
                ->where('id', '=', $dev)
                ->first();

            if (!$pedido) {
                echo $dev . '<br>';
                continue;
            }

            if (sizeof($notaVenda) == 0) {
                preg_match('/número:\ ?[0-9]{4,5}/', $output, $notaVenda);
            }

            if (sizeof($notaVenda) > 0) {
                echo '"' . $dev . 
                    '","' . str_replace(':', '', substr($notaVenda[0], -5)) . 
                    '","' . Carbon::createFromFormat('Y-m-d', $pedido->nota->data)->format('d/m/Y') .
                    '","R$' . number_format($pedido->total * -1, 2, ',', '.') .
                    '","' . $pedido->produtos[0]->produto->titulo .
                    '","' . $pedido->endereco->uf . '"<br>';
            } else {
                echo '"' . $dev . 
                    '","' . 'SEM VENDA' . 
                    '","' . Carbon::createFromFormat('Y-m-d', $pedido->nota->data)->format('d/m/Y') .
                    '","R$' . number_format($pedido->total * -1, 2, ',', '.') .
                    '","' . $pedido->produtos[0]->produto->titulo .
                    '","' . $pedido->endereco->uf . '"<br>';
            }
        }
    }

    /**
     * Busca de pedidos
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function search()
    {
        $query = Input::get('search');

        /**
         * Pedidos
         */
        $busca = Pedido::with([
            'nota',
            'cliente',
            'rastreios', 'rastreios.rastreioRef',
            'rastreios.pedido', 'rastreios.pedido.cliente', 'rastreios.pedido.endereco',
            'rastreios.pi', 'rastreios.pi.rastreioRef',
            'rastreios.devolucao', 'rastreios.devolucao.rastreioRef',
            'rastreios.logistica', 'rastreios.logistica.rastreioRef',
        ])
            ->join('pedido_notas', 'pedidos.id', '=', 'pedido_notas.pedido_id')
            ->join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
            ->join('cliente_enderecos', 'pedidos.cliente_endereco_id', '=', 'cliente_enderecos.id')
            ->leftJoin('pedido_rastreios', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->leftJoin('pedido_rastreio_pis', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->leftJoin('pedido_rastreio_logisticas', 'pedido_rastreios.id', '=', 'pedido_rastreio_logisticas.rastreio_id')
            ->leftJoin('pedido_produtos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')

            ->orWhere('pedidos.id', 'LIKE', '%' . $query . '%')
            ->orWhere('pedidos.codigo_marketplace', 'LIKE', '%' . $query . '%')
            ->orWhere('clientes.nome', 'LIKE', '%' . $query . '%')
            ->orWhere('cliente_enderecos.cep', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreios.rastreio', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreio_pis.codigo_pi', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreio_logisticas.autorizacao', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_produtos.imei', 'LIKE', '%' . $query . '%')

            ->groupBy('pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC')

            ->get([
                'pedidos.*'
            ]);

        return $this->listResponse($busca);
    }
}
