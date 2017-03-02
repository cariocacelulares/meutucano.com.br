<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use NFePHP\Extras\Danfe;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Skyhub\Http\Controllers\SkyhubController;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Nota\Devolucao;
use Core\Http\Requests\Nota\DeleteRequest;

/**
 * Class NotaController
 * @package Core\Http\Controllers\Pedido
 */
class NotaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Nota::class;

    /**
     * Deleta um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id, DeleteRequest $request)
    {
        try {
            $model = self::MODEL;
            $nota = $model::findOrFail($id);

            $nota->delete_note = Input::get('delete_note');
            $nota->save();

            $nota->delete();

            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Gera o XML da nota fiscal
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function xml($id, $devolucao)
    {
        if ($devolucao) {
            $nota = Devolucao::find($id);
        } else {
            $model = self::MODEL;
            $nota = $model::find($id);
        }

        // Nota fiscal não existe
        if ($nota) {
            $file_path = storage_path('app/public/nota/' . $nota->arquivo);

            // Arquivo físico não existe
            if (!file_exists($file_path)) {
                return $this->notFoundResponse();
            }

            return response()
                ->make(file_get_contents($file_path), '200')
                ->header('Content-Type', 'text/xml');
        }

        return $this->notFoundResponse();
    }

    /**
     * Envia um e-mail ao cliente com a nota fiscal
     *
     * @param $id
     * @return Response
     */
    public function email($id)
    {
        try {
            $model = self::MODEL;
            $nota = $model::find($id);

            if ($nota) {
                $dataHora = date('His');
                $arquivo  = storage_path('app/public/' . $dataHora . '.pdf');
                $email    = $nota->pedido->cliente->email;

                if ($email) {
                    if (\Config::get('core.email_send_enabled')) {
                        $mail = Mail::send('emails.danfe', [], function ($message) use ($id, $email, $arquivo) {
                            with(new NotaController())->danfe($id, 'F', $arquivo);

                            $message
                                ->attach($arquivo, ['as' => 'nota.pdf', 'mime' => 'application/pdf'])
                                ->from('vendas@cariocacelulares.com.br', 'Carioca Celulares Online')
                                ->to($email)
                                ->subject('Nota fiscal de compra na Carioca Celulares Online');
                        });

                        unlink($arquivo);
                    } else {
                        \Log::debug("O e-mail não foi enviado para {$email} pois o envio está desativado (nota)!");
                    }

                    if ($mail) {
                        \Log::debug('E-mail de venda enviado para: ' . $email);

                        return $this->showResponse(['send' => true]);
                    } else {
                        \Log::warning('Falha ao enviar e-mail de venda para: ' . $email);

                        return $this->showResponse(['send' => false]);
                    }
                } else {
                    Log::warning('Falha ao enviar e-mail de venda, email inválido');

                    return $this->showResponse(['send' => false]);
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Falha ao tentar enviar um e-mail de venda', [$id]);

            return $this->clientErrorResponse();
        }

        return $this->notFoundResponse();
    }

    /**
     * Gera o arquivo PDF da DANFe
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function danfe($id, $retorno = 'I', $caminhoArquivo = false)
    {
        try {
            $model = self::MODEL;
            $nota = $model::find($id);

            $nota = $nota ?: Devolucao::find($id);

            if ($nota) {
                $file_path = storage_path('app/public/nota/'. $nota->arquivo);

                if (file_exists($file_path)) {
                    $xml = file_get_contents($file_path);

                    $danfe = new Danfe(
                        $xml,
                        'P',
                        'A4',
                        public_path('assets/img/logocarioca.jpg'),
                        public_path('assets/img/watermark.jpg'),
                        $retorno,
                        ''
                    );

                    $nomeDanfe = ($caminhoArquivo) ?: substr($nota->arquivo, 0, -4) . '.pdf';

                    $danfe->montaDANFE('P', 'A4', 'L');
                    $danfe->printDANFE($nomeDanfe, $retorno);

                    return $this->showResponse([]);
                }
            }
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar imprimir DANFe'), [$id]);

            return $this->clientErrorResponse('Falha ao tentar imprimir DANFe');
        }

        return $this->notFoundResponse();
    }

    /**
     * Envia os dados de faturamento para a Skyhub
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function faturar($pedido_id)
    {
        return with(new SkyhubController())->orderInvoice($pedido_id);
    }
}
