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

/**
 * Class SearchController
 * @package App\Http\Controllers
 */
class SearchController extends Controller
{
    use RestResponseTrait;

    public function imei() 
    {
        $imei = [
            '355461060906802',
            '358972060251277',
            '359000060583173',
            '359000061039316',
            '359000061040793',
            '359000061054356',
            '359000061059553',
            '359000061138795',
            '359000061139736',
            '359000061140833',
            '359000061149776',
            '359000061158215',
            '359000061497217',
            '355461060910762',
            '358972069652137',
            '359000061037237',
            '359000061039357',
            '359000061047095',
            '359000061054810',
            '359000061062037',
            '359000061139611',
            '359000061140692',
            '359000061149313',
            '359000061153554',
            '359000061159098',
            '354105078591756',
            '354105078672135',
            '354105078675096',
            '354105078675955',
            '354105078700951',
            '354105078709176',
            '354105078720033',
            '354105078721353',
            '354105078728556',
            '354105078730974',
            '354105078732830',
            '354105078738795',
            '354105078739470',
            '354105078740635',
            '354105078741377',
            '354105078742276',
            '354105078742573',
            '354105078743191',
            '354105078744132',
            '354105078761177',
            '354105078772430',
            '354105078787313',
            '354105078793899',
            '354105078797197',
            '354105078799599',
            '354105078821674',
            '354105078826699',
            '354105078851473',
            '354105078853073',
            '354105078860870',
            '354105078645057',
            '354105078674636',
            '354105078675617',
            '354105078684692',
            '354105078706594',
            '354105078715132',
            '354105078720876',
            '354105078725610',
            '354105078730396',
            '354105078731550',
            '354105078737417',
            '354105078739413',
            '354105078739835',
            '354105078740999',
            '354105078741831',
            '354105078742292',
            '354105078742730',
            '354105078743571',
            '354105078746319',
            '354105078766051',
            '354105078786851',
            '354105078787636',
            '354105078796751',
            '354105078799110',
            '354105078810636',
            '354105078823779',
            '354105078847976',
            '354105078852695',
            '354105078859039',
            '354105078881678',
            '353514073560909',
            '353514073561261',
            '353514073641725',
            '353514073642830',
            '353514073643168',
            '353514073561048',
            '353514073563218',
            '353514073642673',
            '353514073643135',
            '353514073560933',
            '353514073561519',
            '353514073641626',
            '353514073642822',
            '353514073643143',
            '353514073560974',
            '353514073563192',
            '353514073641774',
            '353514073643127',
            '353514073560925',
            '353514073561501',
            '353514073563127',
            '353514073641758',
            '353514073642855',
            '353514073643176',
            '353514073561089',
            '353514073563176',
            '353514073641766',
            '353514073643010',
            '353514073643184',
            '353514073368808',
            '353514073371232',
            '353514073425178',
            '353514073425491',
            '353514073425632',
            '353514073468319',
            '353514073468459',
            '353514073468780',
            '353514073371091',
            '353514073424635',
            '353514073425475',
            '353514073425574',
            '353514073468111',
            '353514073468418',
            '353514073468616',
            '353514073371125',
            '353514073424924',
            '353514073425483',
            '353514073425582',
            '353514073468129',
            '353514073468426',
            '353514073468632',
            '353514073471222',
            '353514073471206',
            '353514073469630',
            '353514073371059',
            '353514073423363',
            '353514073425343',
            '353514073425541',
            '353514073468061',
            '353514073468400',
            '353514073468608',
            '353514073370564',
            '353514073423132',
            '353514073425186',
            '353514073425509',
            '353514073468012',
            '353514073468368',
            '353514073468467',
            '353514073371042',
            '353514073423348',
            '353514073425202',
            '353514073425533',
            '353514073468046',
            '353514073468392',
            '353514073468533',
            '353514073471172',
            '353514073468814',
            '353514073471289',
            '353514073471214',
            '353514073526892',
            '353514073570940',
            '353514073571419',
            '353514073571492',
            '353514073571963',
            '353514073570882',
            '353514073570981',
            '353514073571427',
            '353514073571583',
            '353514073572607',
            '353514073570890',
            '353514073571005',
            '353514073571435',
            '353514073571609',
            '353514073572623',
            '353514073570908',
            '353514073571013',
            '353514073571443',
            '353514073571641',
            '353514073572656',
            '353514073570916',
            '353514073571229',
            '353514073571450',
            '353514073571831',
            '353514073573373',
            '353514073570932',
            '353514073571401',
            '353514073571468',
            '353514073571849',
            '353514073573811',
            '352198076669809',
            '352198076671185',
            '352198076671300',
            '352198076670823',
            '352198076671243',
            '352198076611827',
            '352198077283808',
            '352198077458426',
            '352198078281520',
            '352198078282783',
            '352198078283021',
            '352198078283120',
            '352198078284342',
            '352198076613583',
            '352198077424303',
            '352198078280480',
            '352198078282742',
            '352198078282965',
            '352198078283047',
            '352198078283146',
            '352910070964147',
            '352910070987197',
            '352910070989219',
            '352910071151512',
            '352910071158970',
            '352910071159432',
            '352910071160414',
            '352910071161537',
            '352910070965359',
            '352910070987825',
            '352910070989557',
            '352910071158400',
            '352910071159044',
            '352910071160356',
            '352910071161255',
            '352910071746444',
            '354016078303110',
            '354016078309612',
            '354016078317771',
            '354016078320999',
            '354016078326624',
            '354016078327671',
            '354016078328166',
            '354016078328638',
            '354016078335328',
            '354016078341482',
            '354016078342514',
            '354016078344130',
            '354016078344932',
            '354016078355540',
            '354016078302666',
            '354016078309422',
            '354016078311246',
            '354016078320130',
            '354016078326236',
            '354016078327655',
            '354016078327713',
            '354016078328299',
            '354016078334164',
            '354016078341342',
            '354016078341920',
            '354016078343900',
            '354016078344841',
            '354016078353099',
            '354016078356894',
            '352763071707258',
            '352763071713173',
            '352763071982794',
            '352763071983073',
            '352763071983677',
            '352763071983974',
            '352763071985375',
            '352763071994476',
            '352763071996133',
            '352763071707316',
            '352763071713298',
            '352763071982836',
            '352763071983099',
            '352763071983693',
            '352763071983990',
            '352763071985433',
            '352763071995135',
            '352763071996158',
            '352763071707332',
            '352763071982372',
            '352763071982851',
            '352763071983115',
            '352763071983792',
            '352763071984014',
            '352763071985474',
            '352763071995150',
            '352763071996174',
            '352763071712530',
            '352763071982638',
            '352763071983057',
            '352763071983594',
            '352763071983958',
            '352763071985359',
            '352763071994435',
            '352763071996091',
            '352763071707415',
            '352763071982513',
            '352763071982976',
            '352763071983156',
            '352763071983834',
            '352763071984071',
            '352763071985516',
            '352763071995952',
            '352763071996216',
            '352763071708173',
            '352763071982539',
            '352763071982992',
            '352763071983172',
            '352763071983875',
            '352763071984915',
            '352763071985532',
            '352763071995978',
            '352763071996232',
            '352763071709791',
            '352763071982570',
            '352763071983032',
            '352763071983198',
            '352763071983917',
            '352763071985276',
            '352763071985557',
            '352763071996075',
            '352763071707357',
            '352763071982414',
            '352763071982919',
            '352763071983131',
            '352763071983818',
            '352763071984055',
            '352763071985490',
            '352763071995697',
            '352763071996190',
            '352763071882812',
            '352763071883331',
            '352763071936451',
            '352763071937277',
            '352763071937939',
            '352763071938416',
            '352763071939174',
            '352763071883190',
            '352763071931254',
            '352763071936857',
            '352763071937699',
            '352763071938051',
            '352763071938739',
            '352763071882978',
            '352763071930777',
            '352763071936634',
            '352763071937392',
            '352763071937996',
            '352763071938499',
            '352763071882994',
            '352763071931171',
            '352763071936659',
            '352763071937418',
            '352763071938010',
            '352763071938515',
            '352763071883059',
            '352763071931239',
            '352763071936675',
            '352763071937574',
            '352763071938036',
            '352763071938630',
            '352763071882937',
            '352763071883497',
            '352763071936618',
            '352763071937319',
            '352763071937954',
            '352763071938473',
            '352763071939216',
            '352763071883257',
            '352763071931270',
            '352763071937079',
            '352763071937715',
            '352763071938135',
            '352763071939091',
            '352763071883315',
            '352763071932831',
            '352763071937152',
            '352763071937897',
            '352763071938259',
            '352763071939158',
            '352347071071475',
            '352347071166697',
            '352347071166119',
            '352347071161235',
            '352347071162035',
            '352347071165673',
            '352347071159478',
            '352347071166754',
            '352347071166275',
            '352347071166457',
            '354101070883481',
            '354101070754807',
            '354101070900145',
            '354101070893969',
            '354101070901382',
            '354101070900582',
            '354101070901804',
            '356315062100773',
            '356315062100740',
            '356315062100617',
            '356315062100807',
            '356315062100484',
            '356315061923225',
            '356315061923316',
            '356315061923357',
            '356315061923241',
            '356315061923209',
            '356315061886810',
            '356315061889053',
            '356315061889038',
            '356315061889103',
            '356315061887305',
            '356315061882116',
            '356315061889012',
            '356315061888253',
            '356315061919694',
            '356315061919835',
            '356315061919710',
            '356315061919868',
            '356315061919843',
            '356315062100690',
            '356315062100526',
            '356315062100922',
            '356315062100856',
            '356315062100682',
            '356315061923233',
            '356315061923340',
            '356315061921344',
            '356315061921567',
            '356315061923217',
            '356315061881902',
            '356315061888998',
            '356315061887123',
            '356315061889046',
            '356315061890788',
            '356315061890465',
            '356315061889004',
            '356315061919884',
            '356315061920320',
            '356315061919900',
            '356315061919702',
            '356315061919876',
            '356315061958890',
            '356315061954048',
            '356315061954030',
            '356315061953958',
            '356315061958908',
            '356315061956340',
            '356315061956175',
            '356315061956209',
            '356315061956308',
            '356315061965515',
            '356315061958619',
            '356315061966554',
            '356315061966539',
            '356315061966547',
            '356315061958189',
            '356315061957520',
            '356315061954063',
            '356315061957686',
            '356315061957504',
            '356315061958916',
            '356315061947646',
            '356315061947752',
            '356315061942902',
            '356315061957736',
            '356315061947380',
            '356315061957876',
            '356315061957843',
            '356315061957868',
            '356315061948438',
            '356315061954022',
            '356315061956290',
            '356315061956183',
            '356315061964757',
            '356315061965648',
            '356315061964765',
            '356315061996460',
            '356315061997203',
            '356315062101565',
            '356315062109659',
            '356315062101599',
            '356315062101656',
            '356315062101615',
            '356315062108891',
            '356315061963163',
            '356315061963320',
            '356315061962983',
            '356315061962959',
            '356315061957801',
            '356315061957751',
            '356315061957769',
            '356315061957603',
            '356315061957827',
            '356315061957546',
            '356315061954113',
            '356315061954055',
            '356315061954204',
            '356315061957561',
            '356315061964773',
            '356315061956191',
            '356315061965556',
            '356315061956159',
            '356315061965507',
            '356315061958478',
            '356315061966570',
            '356315061966612',
            '356315061958577',
            '356315061966562',
            '356315061954121',
            '356315061957694',
            '356315061957538',
            '356315061957512',
            '356315061957652',
            '356315061955508',
            '356315061948131',
            '356315061955268',
            '356315061957728',
            '356315061957819',
            '356315061957892',
            '356315061957835',
            '356315061957884',
            '356315061954295',
            '356315061954014',
            '356315061956241',
            '356315061956282',
            '356315061964732',
            '356315061965358',
            '356315061964781',
            '356315061996908',
            '356315061954337',
            '356315062101532',
            '356315062109154',
            '356315062101557',
            '356315061963213',
            '356315062101623',
            '356315061963312',
            '356315061963155',
            '356315061963296',
            '356315061963304',
            '356315061963270',
            '356315061957710',
            '356315061957777',
            '356315061957793',
            '356315061957744',
            '356315061957702'
        ];

        set_time_limit(0);

        $remove = [];
        $achou  = [];
        $files = glob(storage_path('app/public/nota/*00100002*.xml'));
        $files = array_reverse($files);
        foreach ($files as $nota) {
            $output = file_get_contents($nota);
            if (substr($output, 0, 5) !== '<?xml')
                continue;

            $xml = simplexml_load_string($output);

            $nfe = $xml->NFe->infNFe;

            if (!is_object($nfe))
                continue;

            if (!property_exists($nfe, 'det'))
                break;

            $produtos = null;
            if (sizeof($nfe->det) > 1) {
                $produtos = $nfe->det;
            } else {
                $produtos[] = $nfe->det;
            }

            $operacao = $produtos[0]->prod->CFOP;

            if (!in_array((int) $operacao, \Config::get('tucano.operacoes')))
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
                    $achou[]  = $busca . ';' . $nfe->dest->enderDest->UF . ';' . $idPedido . '<br>';
                    // unset($imei[array_search($busca, $imei)]);

                    break;
                 }
            }

            // break;
        }

        echo implode('', array_reverse($achou));
        print_r($imei);
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
