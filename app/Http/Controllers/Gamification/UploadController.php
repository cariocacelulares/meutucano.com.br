<?php namespace App\Http\Controllers\Gamification;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Gamification\Traits\SlugableTrait;
use Illuminate\Support\Facades\Input;

/**
 * Class UploadController
 * @package App\Http\Controllers\Gamification
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
        }

        return $this->clientErrorResponse('Não foi possível efetuar o upload do arquivo');
    }
}