import { default as CommonTransformer } from 'common/transformer'

const STATUS_COLORS = {
  0: 'default',
  1: 'primary',
  2: 'warning',
  4: 'info',
  3: 'success',
  5: 'danger',
  6: 'darker',
}

const SHIPMENT_STATUS_COLORS = {
  0: 'default',
  1: 'primary',
  2: 'warning',
  3: 'danger',
  4: 'success',
  5: 'darker',
}

const Transformer = {
  transform: (order) => {
    order.status_color = STATUS_COLORS[order.status]

    if (typeof(order.shipments) != 'undefined' && order.shipments) {
      order.shipments = order.shipments.map((item) => {
        return Transformer.transformShipment(item)
      })
    }

    return order
  },

  transformShipment: (shipment) => {
    const status = shipment.status

    shipment.status = {
      code: status,
      description: shipment.status_cast,
      color: SHIPMENT_STATUS_COLORS[status],
    }

    return shipment
  },
}

export default Transformer
