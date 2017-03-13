<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock\Entry;

/**
 * Class EntryController
 * @package Core\Http\Controllers\Stock
 */
class EntryController extends Controller
{
    use RestControllerTrait;

    const MODEL = Entry::class;

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)
            ::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}
