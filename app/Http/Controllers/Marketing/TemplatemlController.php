<?php namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Sunra\PhpSimple\HtmlDomParser;

class TemplatemlController extends Controller
{
    use RestResponseTrait;

    /**
     * Generate template 
     *
     * @param $servico
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function generateTemplate()
    {
        $url = Input::get('url');

        if (!$url)
            return false;

        $dom = HtmlDomParser::file_get_html($url);

        $img = $dom->find('meta[property="og:image"]', 0)->content;
        $info = $dom->find('.product-info-tab', 0)->find('.col-md-3');

        foreach ($info as $key => $productInfo) {
            $htmlInfo[] = sprintf('
                <tr>
                  <td style="border-bottom: 1px solid #ccc;font-weight:bold;padding:12px 0;">%s</td>
                  <td align="right" style="border-bottom: 1px solid #ccc;padding:12px 0;">%s</td>
                </tr>', 
                $productInfo->find('.additional', 0)->find('strong', 0)->innertext,
                $productInfo->find('.additional', 0)->find('p', 0)->innertext);
        }

        $info = implode('', $htmlInfo);

        $template = '
            <table style="text-align: center;" width="910" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">  
              <tbody>      
                <tr>      
                  <td colspan="2" width="910"> 
                    <img src="http://acao.cariocacelulares.com.br/templateml/images/template_01.jpg" width="910" height="287" border="0">
                  </td>   
                </tr>     
                <tr>      
                  <td colspan="2" width="910" style="padding: 50px 0;"> 
                    <table cellpadding="0" cellspacing="0" width="910">
                      <tr>
                        <td width="25"></td>
                        <td width="425">
                          <img width="425" src="%s">
                        </td>
                        <td width="10"></td>
                        <td width="425">
                          <table cellspacing="0" cellpadding="0" width="425" style="font-family: Arial, sans-serif; font-size: 13px;">
                            %s
                          </table>
                        </td>
                        <td width="25"></td>
                      </tr>
                    </table>
                  </td>   
                </tr>  
                <tr>      
                  <td colspan="2" width="910"> 
                    <img src="http://acao.cariocacelulares.com.br/templateml/images/template_03.jpg" width="910" height="497" border="0">
                  </td>   
                </tr>  
                <tr>      
                  <td colspan="2" width="910"> 
                    <img src="http://acao.cariocacelulares.com.br/templateml/images/template_04.jpg" width="910" height="671" border="0">
                  </td>   
                </tr>  
                <tr>      
                  <td colspan="2" width="910"> 
                    <img src="http://acao.cariocacelulares.com.br/templateml/images/template_05.jpg" width="910" height="314" border="0">
                  </td>   
                </tr>       
              </tbody>
            </table>
        ';

        $response['template'] = sprintf($template, $img, $info);

        return $this->showResponse($response);
    }
}
