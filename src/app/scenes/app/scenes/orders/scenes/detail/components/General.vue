<template>
  <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
    <div class="grid general">
      <Card header-icon="info" header-text="Detalhes">
        <div class="card-data">
          <span>Data do pedido</span>
          <strong>{{ order.created_at | dateTime }}</strong>
        </div>

        <div class="card-data">
          <span>Método de pagamento</span>
          <strong>{{ order.payment_method.title }} ({{ order.installments }}x)</strong>
        </div>

        <div class="card-data">
          <span>Método de envio</span>
          <strong>{{ order.shipment_method.title }}</strong>
        </div>
      </Card>

      <Card header-icon="user" header-text="Informações de cliente">
        <div class="grid-2 row-gap-0">
          <div class="card-data">
            <span>Nome do cliente</span>
            <strong><a href="#">{{ order.customer.name }}</a></strong>
          </div>

          <div class="card-data">
            <span>Documento</span>
            <strong v-clipboard="order.customer.taxvat">{{ order.customer.taxvat | taxvat }}</strong>
          </div>

          <div>
            <div class="card-data">
              <span>E-mail de contato</span>
              <strong v-if="order.customer.email">{{ order.customer.email }}</strong>
              <strong v-if="!order.customer.email" class="text-dark">não informado</strong>
            </div>

            <div class="card-data span-2">
              <span>Telefone</span>
              <strong>{{ order.customer.phone | phone }}<!--b><br/>(47) 98898-3927</b--></strong>
            </div>
          </div>

          <div class="card-data address">
            <span v-html="order.customer_address.address"></span>
          </div>
        </div>
      </Card>

      <Card header-icon="list-alt" header-text="Produtos" class="products">
        <table class="discrete-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th class="text-left">Produto</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order_product in order.order_products_grouped">
              <td><a href="#">{{ order_product.product.sku }}</a></td>
              <td class="text-left">
                <p>{{ order_product.product.title }}</p>
                <b>{{ order_product.product_serial ? order_product.product_serial.serial : '' }}</b>
              </td>
              <td>{{ order_product.price | money }}</td>
              <td>{{ order_product.quantity }}</td>
              <td>{{ order_product.subtotal | money }}</td>
            </tr>
          </tbody>
        </table>
        <div class="table-values">
          <div class="card-data">
            <span>Subtotal</span>
            <strong>{{ order.subtotal | money }}</strong>
          </div>

          <span class="signal">+</span>

          <div class="card-data">
            <span>Valor de frete</span>
            <strong>{{ order.shipment_cost | money }}</strong>
          </div>

          <span class="signal">+</span>

          <div class="card-data">
            <span>Taxas</span>
            <strong>{{ order.taxes | money }}</strong>
          </div>

          <span class="signal">-</span>

          <div class="card-data">
            <span>Descontos</span>
            <strong>{{ order.discount | money }}</strong>
          </div>

          <span class="signal">=</span>

          <div class="card-data">
            <span>Total</span>
            <strong>{{ order.total | money }}</strong>
          </div>
        </div>
      </Card>
    </div>

    <VSeparator :spacing="0" />

    <div class="invoices">
      <strong>Notas fiscais</strong>

      <Alert v-if="!order.invoices.length" color="light" text="dark" :text-center="true">Nenhuma nota fiscal cadastrada</Alert>

      <template v-for="invoice in order.invoices">
        <Card header-icon="file-code-o" :header-text="invoice.invoice.number + ' / ' + invoice.invoice.series">
          <div slot="header">
            <a :href="invoice.print_url" target="_blank" class="text-bold text-darker">
              <Icon name="print" />
            </a>
            <VSeparator :height="10" :spacing="10" />
            <a href="#" @click.prevent="$confirm(destroyInvoice, invoice.id)" class="text-darker">
              <Icon name="times" />
            </a>
          </div>

          <div class="grid-2 no-card-spacing">
            <div class="card-data">
              <span>Emitida em</span>
              <strong>{{ invoice.created_at | date }}</strong>
            </div>

            <div class="card-data">
              <span>Emitida por</span>
              <strong>{{ invoice.user.name }}</strong>
            </div>
          </div>

          <template v-if="invoice.devolutions" slot="footer">
            <div v-for="devolution in invoice.devolutions" class="devolution">
              <span>Devolução em <b>{{ devolution.created_at | date }}</b></span>
              <div>
                <a :href="devolution.print_url" target="_blank"><Icon name="print" /></a>
                <VSeparator :height="10" :spacing="10" />
                <a href="#" @click.prevent="$confirm(destroyInvoiceDevolution, devolution.id)">
                  <Icon name="times" />
                </a>
              </div>
            </div>
          </template>
        </Card>
      </template>
    </div>

    <div class="shipments">
      <strong>Rastreios</strong>

      <Alert v-if="!order.shipments.length" color="light" text="dark" :text-center="true">Nenhum rastreio cadastrado</Alert>

      <template v-for="shipment in order.shipments">
        <Card header-icon="truck" :header-text="shipment.tracking_code" :footer-sep="true">
          <div slot="header">
            <a :href="shipment.print_url" target="_blank" class="text-darker">
              <Icon name="print" />
            </a>
            <VSeparator :height="10" :spacing="10" />
            <a href="#" @click.prevent="$confirm(destroyShipment, shipment.id)" class="text-darker">
              <Icon name="times" />
            </a>
          </div>

          <div class="grid-3">
            <div class="card-data">
              <span>Enviado em</span>
              <strong>{{ shipment.sent_at | date }}</strong>
            </div>

            <div class="card-data">
              <span>Prazo</span>
              <strong>{{ shipment.deadline }} dias</strong>
            </div>

            <Badge type="label" height="26px" :color="shipment.status_color">{{ shipment.status_cast }}</Badge>
          </div>

          <div slot="footer" class="card-footer">
            <div>
              <a href="#" @click.prevent="openLogistic" v-tooltip="'Logística reversa'"
                :class="{ disabled: !shipment.logistic }">
                <Icon name="exchange" />
              </a>
              <a href="#" @click.prevent="openDevolution" v-tooltip="'Devolução'"
                :class="{ disabled: !shipment.devolution }">
                <Icon name="undo" />
              </a>
              <a href="#" @click.prevent="openIssue" v-tooltip="'Pedido de informação'"
                :class="{ disabled: !shipment.issue }">
                <Icon name="exclamation-triangle" />
              </a>
            </div>

            <div>
              <a href="#" :class="{ disabled: !shipment.monitored }" @click.prevent="toggleMonitored(shipment)"
                v-tooltip="shipment.monitored ? 'Parar de monitorar' : 'Monitorar'">
                <Icon name="video-camera" />
              </a>
            </div>
          </div>
        </Card>
      </template>
    </div>

    <Devolution />
    <Logistic />
    <Issue />
  </ContentBox>
</template>

<script>
import Devolution from './general/Devolution'
import Logistic from './general/Logistic'
import Issue from './general/Issue'

export default {
  components: {
    Devolution,
    Logistic,
    Issue,
  },

  data() {
    return {
      loading: true,
    }
  },

  methods: {
    fetch() {
      this.$store.dispatch('orders/detail/FETCH_ORDER', this.$route.params.id).then((response) => {
        this.loading = false
      })
    },

    openDevolution() {
      this.$root.$emit('show::modal-Devolution')
    },

    openLogistic() {
      this.$root.$emit('show::modal-Logistic')
    },

    openIssue() {
      this.$root.$emit('show::modal-Issue')
    },

    destroyInvoice(id) {
      axios.delete(`orders/invoices/${id}`).then((response) => {
        this.fetch()
      })
    },

    destroyInvoiceDevolution(id) {
      axios.delete(`orders/invoices/devolutions/${id}`).then((response) => {
        this.fetch()
      })
    },

    destroyShipment(id) {
      axios.delete(`orders/shipments/${id}`).then((response) => {
        this.fetch()
      })
    },

    toggleMonitored(shipment) {
      if (shipment.monitored) {
        axios.delete(`orders/shipments/monitors/${shipment.monitored.id}`).then((response) => {
          this.$toaster.warning('Sucesso', 'Você deixou de monitorar este rastreio!');
          this.fetch()
        })
      } else {
        axios.post(`orders/shipments/monitors`, {
          order_shipment_id: shipment.id
        }).then((response) => {
          this.$toaster.success('Sucesso', 'Agora você está monitorando este rastreio!');
          this.fetch()
        })
      }
    },
  },

  computed: {
    order() {
      return this.$store.getters['orders/detail/GET_ORDER']
    },
  },

  beforeMount() {
    this.fetch()
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

$gap: 20px;

.ContentBox {
  grid-template-columns: calc(52% - 21px) 1px calc(24% - 40px) 24%;
  grid-gap: $gap;
  grid-auto-flow: row;

  .grid.general {
    grid-template-columns: 200px calc(100% - 200px - #{$gap});
    grid-gap: $gap;
    grid-auto-flow: row;

    .address * {
      color: $dark;
      font-size: 13px;
      line-height: 1.3;
    }

    .products {
      grid-column-end: span 2;
    }
  }

  .invoices,
  .shipments {
    display: flex;
    flex-direction: column;

    .Card:first-of-type {
      margin-top: 10px;
    }

    > strong {
      font-size: 14px;
      color: $darker;
    }

    > * {
      &:not(:first-child) {
        margin-top: $gap;
      }
    }
  }

  .invoices {
    .devolution {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0;
      height: 35px;
      padding: 0 20px;
      font-size: 12px;
      color: $white;
      background-color: #C9403C;
      box-shadow: $defaultShadow;

      &:last-child {
        border-radius: 0 0 $borderRadius $borderRadius;
      }

      a {
        color: $white;
      }
    }
  }

  .shipments {
    .Badge {
      margin-top: 4px;
    }

    .card-footer {
      padding: 15px 20px;

      > div > :not(:first-child) {
        margin-left: 20px;
      }

      .disabled,
      [disabled] {
        opacity: .5;
      }

      a {
        color: $dark;

        &:hover,
        &:focus {
          color: $darker;
        }
      }
    }
  }

  .general .card-data:not(:last-child) {
    margin-bottom: 20px;
  }

  .products {
    .table-values {
      display: flex;
      align-items: center;
      padding-top: 20px;

      .card-data {
        margin-bottom: 0;
      }

      > * {
        flex-grow: 1;
      }

      .signal {
        color: $dark;
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}
</style>
