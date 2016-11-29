<?php namespace Modules\Gamification\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestResponseTrait;
use Modules\Gamification\Http\Controllers\Traits\SlugableTrait;

/**
 * Class UploadController
 * @package Modules\Gamification\Http\Controllers
 */
class UploadController extends Controller
{
    use RestResponseTrait;

    public function upload()
    {
        try {
            $path = 'images/gamification';
            $arquivo = Input::file('arquivo');
            if ($arquivo && in_array($arquivo->getClientOriginalExtension(), ['png', 'jpg', 'jpeg', 'ico', 'gif'])) {
                $nomeArquivo = str_slug($arquivo->getClientOriginalName() . date('d/m/Y H:i:s')) . '.' . $arquivo->getClientOriginalExtension();
                if ($arquivo->move(public_path($path), $nomeArquivo)) {
                    return $this->showResponse($path . '/' . $nomeArquivo);
                }
            }
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Gamification: não foi possível efetuar o upload do arquivo'));
        }

        return $this->clientErrorResponse('Não foi possível efetuar o upload do arquivo');
    }
}