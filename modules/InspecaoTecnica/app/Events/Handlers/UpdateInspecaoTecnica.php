<?php namespace InspecaoTecnica\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderProductProductChanged;
use InspecaoTecnica\Http\Controllers\InspecaoTecnicaController;
use InspecaoTecnica\Models\InspecaoTecnica;

class UpdateInspecaoTecnica
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderProductProductChanged::class,
            '\InspecaoTecnica\Events\Handlers\UpdateInspecaoTecnica@onOrderProductProductChanged'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductProductChanged  $event
     * @return void
     */
    public function onOrderProductProductChanged(OrderProductProductChanged $event)
    {
        $orderProduct = $event->orderProduct;
        $orderProduct = $orderProduct->fresh();

        // Apenas se o produto for pago, enviado ou entregue
        if (in_array((int)$orderProduct->pedido->status, [1, 2, 3])) {
            Log::debug('Handler UpdateInspecaoTecnica/onOrderProductProductChanged acionado.', [$event]);

            $nonReviewedInspection = InspecaoTecnica::whereNull('revisado_at')
                ->where('pedido_produtos_id', '=', $orderProduct->id)
                ->delete();
            Log::notice($nonReviewedInspection . ' inspeções não revisadas foram excluídas', [$orderProduct->id]);

            $reviewedInspection = InspecaoTecnica::whereNotNull('revisado_at')
                ->where('pedido_produtos_id', '=', $orderProduct->id)
                ->update([
                    'pedido_produtos_id' => null
                ]);
            Log::notice($reviewedInspection . ' inspeções não revisadas foram desassociadas', [$orderProduct->id]);

            with(new InspecaoTecnicaController())->attachInspecao($orderProduct);
        }
    }
}
