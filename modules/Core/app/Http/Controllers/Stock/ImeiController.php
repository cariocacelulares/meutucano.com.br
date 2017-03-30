<?php namespace Core\Http\Controllers\Stock;

use \Milon\Barcode\DNS1D;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use \fpdf\FPDF;

/**
 * Class ImeiController
 * @package Core\Http\Controllers\Stock
 */
class ImeiController extends Controller
{
    use RestResponseTrait;

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function generate()
    {
        $listSize = Input::get('listSize', 24);

        $lastGeneratedImei = t('core.stock.last_generated_imei') ?: 0;

        t('core.stock.last_generated_imei',
            $listEnd = $lastGeneratedImei + $listSize);

        $d = new DNS1D();
        $pdf = new FPDF('P', 'mm', [310, 210]);
        $pdf->SetMargins(0, 0, 0);
        $pdf->AddPage();
        $pdf->SetFont('Arial', '', 12);

        $countRows = 1;
        $countColumns = 1;
        for ($i = ($lastGeneratedImei + 1); $i <= $listEnd; $i++) {
            if ($countRows == 13 && $countColumns == 1) {
                $pdf->AddPage();
                $countRows = 1;
            }

            $imei         = 'CA' . str_pad($i, 13, 0, STR_PAD_LEFT);
            $barcodeImage = $d->getBarcodePNG($imei, "C39", 1, 30);
            $pic          = 'data://text/plain;base64,' . $barcodeImage;

            $pdf->Text(($countColumns == 2) ? 125 : 53, (($countRows * 25.4) - 15.4), $imei);
            $pdf->Image($pic, ($countColumns == 2) ? 112.4 : 38, (($countRows * 25.4) - 13.4), 64, 10, 'png');

            if ($countColumns == 2) {
                $countRows++;
                $countColumns = 0;
            }

            $countColumns++;
        }

        $path = 'imeis';
        $fileName = date('YmdHis') . '.pdf';

        $pdfName = "{$path}/{$fileName}";
        $pdf->Output(storage_path('app/public/' . $pdfName), 'F');

        ob_clean();
        return $this->createdResponse([
            'path'     => $path,
            'fileName' => $fileName
        ]);

    }
}
