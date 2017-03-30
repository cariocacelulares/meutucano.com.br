<?php namespace Mercadolivre\Http\Controllers;

use Core\Models\Produto;
use Mercadolivre\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mercadolivre\Models\Template;
use Sunra\PhpSimple\HtmlDomParser;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Magento\Http\Controllers\MagentoController;
use App\Http\Controllers\Rest\RestControllerTrait;
use Mercadolivre\Transformers\TemplateTransformer;

class TemplateController extends Controller
{
    use RestControllerTrait;

    const MODEL = Template::class;

    /**
     * Return templates to table list
     * @return response
     */
    public function tableList()
    {
        $m = self::MODEL;
        $list = $m::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(TemplateTransformer::tableList($list));
    }

    /**
     * Generate template content from template id
     *
     * @param  int $id
     * @return string|boolean
     */
    public function generateTemplate($id)
    {
        try {
            $ad = Ad::findOrFail($id);

            $url = with(new MagentoController())->getProductUrl($ad->product->sku);

            $dom = HtmlDomParser::file_get_html($url);

            $image  = $dom->find('meta[property="og:image"]', 0)->content;
            $info   = $dom->find('.additional');

            $htmlInfo = ['<table cellspacing="0" cellpadding="0" width="400" style="font-size: 13px; font-family: Arial;"><tbody>'];
            foreach ($info as $key => $productInfo) {
                $htmlInfo[] = sprintf(
                    '
                    <tr>
                        <td style="border-bottom: 1px solid #ccc;height: 40px;"><b>%s</b></td>
                        <td style="border-bottom: 1px solid #ccc;height: 40px;text-align: right;">%s</td>
                    </tr>
                    ',
                    $productInfo->find('strong', 0)->innertext,
                    $productInfo->find('p', 0)->innertext
                );
            }
            $htmlInfo[] = '</tbody></table>';

            $attributes = implode('', $htmlInfo);

            return str_replace(['{image}', '{attributes}'], [$image, $attributes], $ad->template->html);
        } catch (\Exception $exception) {
            Log::error(logMessage($exception, 'Não foi possível gerar a template do Mercado Livre!'));
            return false;
        }
    }
}
