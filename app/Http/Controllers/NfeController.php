<?php namespace App\Http\Controllers;

use App\Models\CidadeCodigo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use NFePHP\NFe\MakeNFe;
use NFePHP\NFe\ToolsNFe;

/**
 * Class NfeController
 * @package App\Http\Controllers
 */
class NfeController extends Controller
{
    /**
     * Gera XML da NFe
     *
     * @return string
     */
    public function makeNfe()
    {
        $nfe = new MakeNFe();

        // Dados da nota fiscal
        $cNF      = '00000002';
        $serie    = 1;
        $nNF      = 9;
        $dhEmi    = date("Y-m-d\TH:i:sP");
        $dhSaiEnt = date("Y-m-d\TH:i:sP");
        $idDest   = 1; // 1 - Interna; 2 - Externa;

        // Chave e dígito verificador
        $versao = Config::get('tucano.nfe.versao');

        // Chave
        $chave = $nfe->montaChave(
            Config::get('tucano.nfe.default.cUF'),
            Carbon::createFromFormat('Y-m-d\TH:i:sP', $dhEmi)->format('y'),
            Carbon::createFromFormat('Y-m-d\TH:i:sP', $dhEmi)->format('m'),
            Config::get('tucano.cnpj'),
            Config::get('tucano.nfe.default.venda.mod'),
            $serie,
            $nNF,
            Config::get('tucano.nfe.default.venda.tpEmis'),
            $cNF
        );

        // Inf NFe
        $nfe->taginfNFe($chave, $versao);

        // Identificação
        $nfe->tagide(
            Config::get('tucano.nfe.default.cUF'),
            $cNF,
            Config::get('tucano.nfe.default.venda.natOp'),
            Config::get('tucano.nfe.default.venda.indPag'),
            Config::get('tucano.nfe.default.venda.mod'),
            $serie,
            $nNF,
            $dhEmi,
            $dhSaiEnt,
            Config::get('tucano.nfe.default.venda.tpNf'),
            $idDest,
            Config::get('tucano.nfe.default.venda.cMunFG'),
            Config::get('tucano.nfe.default.venda.tpImp'),
            Config::get('tucano.nfe.default.venda.tpEmis'),
            ((int) substr($chave, -1)),
            Config::get('tucano.nfe.config.tpAmb'),
            Config::get('tucano.nfe.default.venda.finNFe'),
            Config::get('tucano.nfe.default.venda.indFinal'),
            Config::get('tucano.nfe.default.venda.indPres'),
            Config::get('tucano.nfe.default.venda.procEmi'),
            Config::get('tucano.versao')
        );

        // Dados do emitente
        $nfe->tagemit(
            Config::get('tucano.nfe.default.emitente.CNPJ'),
            '',
            Config::get('tucano.nfe.default.emitente.xNome'),
            Config::get('tucano.nfe.default.emitente.xFant'),
            Config::get('tucano.nfe.default.emitente.IE'),
            '',
            Config::get('tucano.nfe.default.emitente.IM'),
            Config::get('tucano.nfe.default.emitente.CNAE'),
            Config::get('tucano.nfe.default.emitente.CRT')
        );

        $nfe->tagenderEmit(
            Config::get('tucano.nfe.default.emitente.enderEmit.xLgr'),
            Config::get('tucano.nfe.default.emitente.enderEmit.nro'),
            Config::get('tucano.nfe.default.emitente.enderEmit.xCpl'),
            Config::get('tucano.nfe.default.emitente.enderEmit.xBairro'),
            Config::get('tucano.nfe.default.emitente.enderEmit.cMun'),
            Config::get('tucano.nfe.default.emitente.enderEmit.xMun'),
            Config::get('tucano.nfe.default.emitente.enderEmit.UF'),
            Config::get('tucano.nfe.default.emitente.enderEmit.CEP'),
            Config::get('tucano.nfe.default.emitente.enderEmit.cPais'),
            Config::get('tucano.nfe.default.emitente.enderEmit.xPais'),
            Config::get('tucano.nfe.default.emitente.enderEmit.fone')
        );

        // Dados do destinatário
        $nfe->tagdest(
            '', //CNPJ
            '04813760970',
            '',
            'Diego Schell Fernandes',
            '9' , // 1- CNPJ com IE; 2 - CNPJ Isento; 9 - CPF,
            '', //IE,
            '',
            '',
            'diego.schell.f@gmail.com'
        );

        $nfe->tagenderDest(
            'Al. Bela Aliança',
            '733',
            'Casa',
            'Jardim América',
            ((string) CidadeCodigo::where('uf', '=', 'SC')->where('cidade', '=', 'Rio do Sul')->first()->codigo),
            'Rio do Sul',
            'SC',
            '89160216',
            '1058',
            'BRASIL',
            '4796523842'
        );

        // Produtos
        $nfe->tagprod(
            1,
            '196',
            '7893299906091',
            'SMARTPHONE LG K10 DUAL TV K430 INDIGO',
            '85171231',
            '',
            '',
            '',
            // 6108 - fora do estado; 6102 - cnpj com inscricao; 5102 - dentro sem st; 5405 - dentro com st;
            // 1202 - dev sem st interna; 1411 - dev com st interna; 2202 - dev externa;
            '5102',
            'UN',
            '1.0000',
            '989.0000000000',
            989.00,
            '',
            'UN',
            '1.0000',
            '989.0000000000',
            '',
            '',
            '',
            '',
            1,
            '',
            '',
            ''
        );

        // Imposto pro produto
        $nfe->tagimposto(1, '');

        $nfe->tagICMS(
            1,
            0,
            /**
                0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8;
                1 - Estrangeira - Importação direta, exceto a indicada no código 6;
                2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7;
                3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%;
                4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes;
                5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%;
                6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural;
                7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX e gás natural.
                8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%;
             */
            '00', //CST
            3, //modBC
            '',
            989.00,
            '12.00',
            '118.68'
        );

        $nfe->tagPIS(
            1,
            '01',
            989.00,
            1.65,
            '16.32'
        );

        $nfe->tagCOFINS(
            1,
            '01',
            989.00,
            '7.60',
            '75.16'
        );

        $nfe->tagICMSUFDest(
            1,
            989.00,
            1.00,
            19.00,
            '12.00',
            40.00,
            9.89,
            37.58,
            41.54
        );

        $nfe->tagICMSTot(
            989.00,
            118.68, //icms
            0.00,
            0.00,
            0.00, //st
            989.00, // produto
            0.00, // frete
            0.00,
            0.00,
            0.00,
            0.00, // IPI
            16.32, // PIS
            75.16, // COFINS
            0.00, // OUTRO
            989.00 // TOTAL NOTA
        );

        //0=Por conta do emitente; 1=Por conta do destinatário/remetente; 2=Por conta de terceiros; 9=Sem Frete;
        $nfe->tagtransp('1');

        $nfe->tagtransporta(
            '',
            '04813760970',
            'Transporte Diego',
            '',
            'Al. Bela Aliança',
            'Rio do Sul',
            'SC'
        );

        $nfe->tagvol(
            '1',
            'Caixa',
            'LG',
            '',
            1,
            1,
            ''
        );

        $infCpl = "Valor Aprox. Tributos R$210.16 - R$50.00Federal, R$100.00Estadual e R$80.00Municipal.";
        $nfe->taginfAdic('', $infCpl);

        $nfe->montaNFe();
        $xml = $nfe->getXML();

        $nfeTools = new ToolsNFe(json_encode(Config::get('tucano.nfe.config')));
        $nfeTools->setModelo('55');
        $xml = $nfeTools->assina($xml);

        if (! $nfeTools->validarXml($xml) ) {
            echo "<h3>Eita !?! Tem bicho na linha .... </h3>";
            foreach ($nfeTools->errors as $erro) {
                if (is_array($erro)) {
                    foreach ($erro as $err) {
                        echo "$err <br>";
                    }
                } else {
                    echo "$erro <br>";
                }
            }
            exit;
        }

        $nfeTools->sefazEnviaLote($xml, Config::get('tucano.nfe.config.tpAmb'), 1, $resposta, 1, false);

        $protFile = Config::get('tucano.nfe.config.pathNFeFiles') . '/homologacao/temporarias/' . date('Ym') . '/' . ((int) 1) . '-retEnviNFe.xml';

        $xml = $nfeTools->addProtocolo($xml, $protFile);

        return response()->make($xml, '200')->header('Content-Type', 'text/xml');
    }
}
