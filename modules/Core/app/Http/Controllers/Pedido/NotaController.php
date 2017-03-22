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
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Generate invoice XML
     *
     * @param $id
     * @return Response
     */
    public function xml($id)
    {
        $invoice = (self::MODEL)::findOrFail($id);

        return \Invoice::xml($invoice->arquivo);
    }

    /**
     * Generate DANFe PDF file
     *
     * @param  $id
     * @param  string  $returnType I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
     * @param  string  $dir        path dir i $returnType is F
     * @return Response
     */
    public function danfe($id, $returnType = 'I', $path = false)
    {
        $invoice = (self::MODEL)::findOrFail($id);

        return \Invoice::danfe($invoice->arquivo, $returnType, $path);
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
            $nota = (self::MODEL)::find($id);

            if ($nota) {
                $dataHora = date('His');
                $arquivo  = storage_path('app/public/' . $dataHora . '.pdf');
                $email    = $nota->pedido->cliente->email;

                if ($email) {
                    if (\Config::get('core.email_send_enabled')) {
                        $mail = Mail::send('emails.danfe', [], function ($message) use ($nota, $email, $arquivo) {
                            \Invoice::danfe($nota->arquivo, 'F', $arquivo);

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
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar enviar um e-mail de venda', [$id]));

            return $this->clientErrorResponse('Falha ao tentar enviar um e-mail de venda');
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
