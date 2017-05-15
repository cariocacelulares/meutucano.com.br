<template>
  <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
    <div class="grid general">
      <Card header-icon="info" header-text="Detalhes">
        <div class="card-data">
          <span>Data do pedido</span>
          <strong>{{ order.created_at | date }}</strong>
        </div>

        <div class="card-data">
          <span>Método de pagamento</span>
          <strong>{{ order.payment_method_cast }} ({{ order.installments }}x)</strong>
        </div>

        <div class="card-data">
          <span>Método de envio</span>
          <strong>{{ order.shipment_method_cast }}</strong>
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
            <strong>{{ order.customer.taxvat }} <Icon name="paperclip"/></strong>
          </div>

          <div>
            <div class="card-data">
              <span>E-mail de contato</span>
              <strong>{{ order.customer.email }}</strong>
            </div>

            <div class="card-data span-2">
              <span>Telefone</span>
              <strong>{{ order.customer.phone }}<!--b><br/>(47) 98898-3927</b--></strong>
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
                <b>{{ order_product.product_serial.serial }}</b>
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
      <Card header-icon="file-code-o" header-text="44318/1" :no-footer-sep="true">
        <div slot="header">
          <a href="#" class="text-bold">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-2 no-card-spacing">
          <div class="card-data">
            <span>Emitida em</span>
            <strong>09/04/2017</strong>
          </div>

          <div class="card-data">
            <span>Emitida por</span>
            <strong>Lidiane Martins</strong>
          </div>
        </div>

        <template slot="footer">
          <div class="devolution">
            <span>Devolução em <b>08/02/1995</b></span>
            <div>
              <a href="#"><Icon name="print" /></a>
              <VSeparator :height="10" :spacing="10" />
              <Icon name="times" />
            </div>
          </div>
        </template>
      </Card>

      <Card header-icon="file-code-o" header-text="44318/1">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-2">
          <div class="card-data">
            <span>Emitida em</span>
            <strong>09/04/2017</strong>
          </div>

          <div class="card-data">
            <span>Emitida por</span>
            <strong>Lidiane Martins</strong>
          </div>
        </div>
      </Card>
    </div>

    <div class="shipments">
      <strong>Rastreios</strong>

      <Card header-icon="truck" header-text="PN717347694BR">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-3">
          <div class="card-data">
            <span>Enviado em</span>
            <strong>08/02/1995</strong>
          </div>

          <div class="card-data">
            <span>Prazo</span>
            <strong>2 dias</strong>
          </div>

          <TLabel height="26px" color="warning">Atrasado</TLabel>
        </div>

        <div slot="footer" class="card-footer">
          <div>
            <a href="#" @click.prevent="openLogistic" class="disabled"><Icon name="exchange" /></a>
            <a href="#" @click.prevent="openDevolution"><Icon name="undo" /></a>
            <a href="#" @click.prevent="openIssue"><Icon name="exclamation-triangle" /></a>
          </div>

          <div>
            <a href="#"><Icon name="video-camera" /></a>
            <a href="#"><Icon name="picture-o" /></a>
          </div>
        </div>
      </Card>

      <Card header-icon="truck" header-text="PN717347694BR">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-3">
          <div class="card-data">
            <span>Enviado em</span>
            <strong>08/02/1995</strong>
          </div>

          <div class="card-data">
            <span>Prazo</span>
            <strong>2 dias</strong>
          </div>

          <TLabel height="26px" color="primary">Enviado</TLabel>
        </div>
      </Card>
    </div>

    <Devolution />
    <Logistic />
    <Issue />
  </ContentBox>
</template>

<script>
import { default as OrderTransformer } from '../../../transformer'
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
      loading: false,
      order: {
        id: null,
    		customer_id: null,
    		customer_address_id: null,
    		shipment_cost: null,
    		shipment_method: null,
    		payment_method: null,
    		installments: null,
    		api_code: null,
    		marketplace: null,
    		total: null,
    		estimated_delivery: null,
    		status: {
          code: null,
          description: null,
          color: null,
        },
    		cancel_protocol: null,
    		holded: null,
    		refunded: null,
    		priority: null,
    		created_at: null,
    		updated_at: null,
    		deleted_at: null,
    		can_hold: null,
    		can_prioritize: null,
    		can_approve: null,
    		can_cancel: null,
    		count_on_stock: null,
    		customer: {
    			id: null,
    			taxvat: null,
    			mercadolivre_id: null,
    			type: null,
    			name: null,
    			phone: null,
    			email: null,
    			document: null,
    			created_at: null,
    			updated_at: null,
    		},
    		customer_address: {
    			id: null,
    			customer_id: null,
    			zipcode: null,
    			street: null,
    			number: null,
    			complement: null,
    			district: null,
    			city: null,
    			state: null,
    			created_at: null,
    			updated_at: null,
    		},
    		order_products: [
    			{
    				id: null,
    				order_id: null,
    				product_sku: null,
    				depot_product_id: null,
    				product_serial_id: null,
    				price: null,
    				created_at: null,
    				updated_at: null,
    				product: {
    					sku: null,
    					brand_id: null,
    					line_id: null,
    					title: null,
    					ean: null,
    					ncm: null,
    					price: null,
    					cost: null,
    					condition: null,
    					warranty: null,
    					created_at: null,
    					updated_at: null,
    					deleted_at: null,
    					reserved_stock: null,
    					available_stock: null,
    				},
    				product_serial: {
    					id: null,
    					depot_product_id: null,
    					serial: null,
    					cost: null,
    					created_at: null,
    					updated_at: null,
    					deleted_at: null,
    				}
    			}
        ]
      }
    }
  },

  methods: {
    openDevolution() {
      this.$root.$emit('show::modal-Devolution')
    },

    openLogistic() {
      this.$root.$emit('show::modal-Logistic')
    },

    openIssue() {
      this.$root.$emit('show::modal-Issue')
    },
  },

  mounted() {
    axios.get(`orders/${this.$route.params.id}`).then(
      (response) => {
        this.order = OrderTransformer.transform(response.data)
      },
      (error) => {
        console.log(error)
      }
    )
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

      a {
        color: $white;
      }
    }
  }

  .shipments {
    .TLabel {
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
