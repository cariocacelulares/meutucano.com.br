<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <template v-if="!creating">
          <FeaturedValue :label="order.marketplace.title" :value="order.api_code || order.id" color="darker" />

          <VSeparator :spacing="20" :height="40" />
          <Badge type="label" :color="order.status_color">{{ order.status_cast }} <span v-if="order.refund">&nbsp;(Reembolso)</span></Badge>
          <FeaturedValue v-if="order.cancel_protocol" label="Protocolo" :value="order.cancel_protocol" color="darker" class="m-l-20" />
        </template>

        <FeaturedValue v-else label="" value="Criar um novo pedido" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>


    <ContentBox :boxed="creating" :discret="true" :class="{ grid: true, creating, loading: loading }">
      <ValidationBox class="m-b-20" />

      <div>
        <Card header-icon="user" header-text="Informações do cliente">
          <div v-if="creating" class="grid-2">
            <TLabel text="Cliente">
              <v-select theme="discrete"
                :inside-search="true"
                :on-search="getCustomers"
                :options="customerList"
                :on-change="customerChanged"
                label="name"
                placeholder="Selecione um cliente"
                search-placeholder="Buscar cliente">
                <template slot="no-options">Nada foi encontrado</template>
              </v-select>
            </TLabel>

            <TSelect label="Endereço" :placeholder="'Selecione um ' + (order.customer_id ? 'endereço' : 'cliente')"
              :options="addressList" v-model="order.customer_address_id" />
          </div>

          <div v-if="!creating" class="grid-2">
            <div class="card-data">
              <span>Nome do cliente</span>
              <strong>{{ order.customer.name }}</strong>
            </div>

            <div class="card-data">
              <span>Documento</span>
              <strong>{{ order.customer.taxvat | taxvat }}</strong>
            </div>

            <div>
              <div class="card-data">
                <span>E-mail de contato</span>
                <strong v-if="order.customer.email">{{ order.customer.email }}</strong>
                <strong v-if="!order.customer.email" class="text-dark">não informado</strong>
              </div>

              <div class="card-data span-2 m-t-20">
                <span>Telefone</span>
                <strong>{{ order.customer.phone | phone }}<!--b><br/>(47) 98898-3927</b--></strong>
              </div>
            </div>

            <div class="card-data address">
              <span v-html="order.customer_address.address"></span>
            </div>
          </div>
        </Card>

        <Card>
          <div class="grid values-options">
            <TSelect label="Método de frete" v-model="order.shipment_method_slug" name="shipment_method_slug" :options="shipmentMethods" placeholder="Selecione" />

            <TLabel text="Valor do frete">
              <InputGroup>
                <Icon name="usd" slot="left" />
                <TInput v-model="order.shipment_cost" name="shipment_cost" slot="input" />
              </InputGroup>
            </TLabel>

            <div>
              <InputGroup label="Método de pagamento" input-classes="grow-5" right-classes="grow-1">
                <TSelect v-model="order.payment_method_slug" name="payment_method_slug" :options="paymentMethods" slot="input" class="full-width" placeholder="Selecione" />
                <TSelect v-model="order.installments" name="installments" :options="installmentsAmount" slot="right" class="full-width" />
              </InputGroup>
            </div>

            <TLabel text="Taxas">
              <InputGroup>
                <Icon name="usd" slot="left" />
                <TInput v-model="order.taxes" name="taxes" slot="input" />
              </InputGroup>
            </TLabel>

            <TLabel text="Descontos">
              <InputGroup>
                <Icon name="usd" slot="left" />
                <TInput v-model="order.discount" name="discount" slot="input" />
              </InputGroup>
            </TLabel>
          </div>

          <table class="discrete-table">
            <thead>
              <tr>
                <th width="125">SKU</th>
                <th class="text-left">Produto</th>
                <th width="147">Preço</th>
                <th width="105">Qtd</th>
                <th width="120">Subtotal</th>
                <th width="12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in order.order_products_grouped">
                <td>{{ product.product_sku }}</td>
                <td class="text-left">{{ product.title || product.product.title }}</td>
                <td>
                  <InputGroup size="small">
                    <Icon name="usd" slot="left" />
                    <TInput v-model="product.price" slot="input" />
                  </InputGroup>
                </td>
                <td>
                  <TInput v-model="product.quantity" size="small" type="number" :min="1"/>
                </td>
                <td>{{ product.total | money }}</td>
                <td>
                  <a href="#" @click.prevent="removeProduct(index)" class="text-success" v-tooltip="'Remover produto'">
                    <Icon name="close" color="danger" />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <ProductSearch v-model="newProduct" />
                </td>
                <td class="text-left">
                  {{ newProduct.title }}
                  <span v-if="!newProduct.product_sku" class="text-dark">Adicionar produto</span>
                </td>
                <td>
                  <InputGroup v-if="newProduct.product_sku" size="small">
                    <Icon name="usd" slot="left" />
                    <TInput v-model="newProduct.price" slot="input" />
                  </InputGroup>
                </td>
                <td>
                  <TInput v-if="newProduct.product_sku" v-model="newProduct.quantity" size="small" type="number" :min="0"/>
                </td>
                <td>
                  <span v-if="newProduct.product_sku">{{ newProduct.total | money }}</span>
                </td>
                <td>
                  <a href="#" @click.prevent="addProduct" class="text-success" v-tooltip="'Adicionar produto'">
                    <Icon v-if="newProduct.product_sku" name="plus" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="table-values">
            <Help side="right" title="Valor formado pela soma do subtotal, frete e taxas subtraído pelo desconto aplicado" />

            <div class="card-data">
              <span>Valor Total</span>
              <strong>{{ order.total || 0 | money }}</strong>
            </div>
          </div>
        </Card>
      </div>

      <VSeparator v-if="!creating" :spacing="0" />

      <div v-if="!creating">
        <CommentsBox :order="order.id" :form="false" :only-important="true" />
      </div>
    </ContentBox>
  </form>
</template>

<script>
export default {
  data() {
    return {
      // select options
      customerList: [],
      addressList: [],
      paymentMethods: [],
      shipmentMethods: [],
      installmentsAmount: [],

      // product
      newProduct: {
        product_sku: null,
        title: null,
        price: null,
        quantity: null,
        total: null,
      },

      loading: false,
    }
  },

  computed: {
    order() {
      if (this.creating) {
        return {
          shipment_cost: null,
          taxes: null,
          discount: null,
          payment_method_slug: null,
        }
      } else {
        return this.$store.getters['orders/detail/GET_ORDER']
      }
    },

    creating() {
      return (typeof(this.$route.params.id) != 'undefined' && this.$route.params.id) ? false : true
    },
  },

  methods: {
    calcTotal() {
      this.order.total = 0

      this.order.order_products_grouped.forEach((product) => {
        product.total = parseFloat(product.price || 0) * parseInt(product.quantity || 0)
        this.order.total += (product.total || 0)
      })

      this.order.total += parseFloat(this.order.taxes || 0)
      this.order.total += parseFloat(this.order.shipment_cost || 0)
      this.order.total -= parseFloat(this.order.discount || 0)
    },

    addProduct() {
      if (this.newProduct.quantity < 1) {
        this.$toaster.warning('Escolha a quantidade do produto antes de adicionar', '')
        return;
      }

      const find = this.order.order_products_grouped.find((product) => product.product_sku == this.newProduct.product_sku)

      if (typeof(find) != 'undefined' && find) {
        this.$toaster.warning('Você já adicionou esse produto!', '')
        return;
      }

      this.order.order_products_grouped.push({
        product_sku: this.newProduct.product_sku,
        title: this.newProduct.title,
        price: this.newProduct.price,
        quantity: this.newProduct.quantity,
        total: this.newProduct.total,
      })

      this.newProduct = {
        product_sku: null,
        title: null,
        price: null,
        quantity: null,
        total: null,
      }
    },

    removeProduct(index) {
      this.order.order_products_grouped.splice(index, 1)
    },

    getCustomers(search, loading) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        loading(true)
        axios.get(`customers/fetch?search=${search}`).then(
          (response) => {
            this.customerList = response.data

            loading(false)
          }
        )
      }.bind(this), 500)
    },

    customerChanged(customer) {
      if (!customer) {
        return;
      }

      this.order.customer_id = customer.id

      axios.get(`customers/addresses/from/${customer.id}`).then(
        (response) => {
          this.addressList = response.data.map((item) => {
            return {
              text: item.address.replace(/<\/?[^>]+(>|$)/g, ''),
              value: item.id,
            }
          })
        }
      )
    },

    save() {
      let order = this.order
      order.products = this.order.order_products_grouped

      if (this.creating) {
        axios.post('orders', order).then(
          (response) => {
            this.$router.push({ name: 'orders.detail', params: { id: response.data.id } })
            this.$toaster.success('Pedido salvo com sucesso!')
          }
        )
      } else {
        axios.put(`orders/${order.id}`, order).then(
          (response) => {
            this.$router.push({ name: 'orders.detail', params: { id: response.data.id } })
            this.$toaster.success('Pedido salvo com sucesso!')
          }
        )
      }
    },
  },

  beforeMount() {
    this.$store.dispatch('global/VALIDATION')

    const creating = (typeof(this.$route.params.id) != 'undefined' && this.$route.params.id) ? false : true

    if (!creating) {
      this.$store.dispatch('orders/detail/FETCH_ORDER', this.$route.params.id).then(
        (response) => {},
        (error) => {
          this.$router.push({ name: 'orders.list' })
        }
      )
    }

    axios.get('payment-methods').then((response) => {
      this.paymentMethods = response.data.map((item) => {
        return {
          text: item.title,
          value: item.slug,
          object: item,
        }
      })
    })

    axios.get('shipment-methods').then((response) => {
      this.shipmentMethods = response.data.map((item) => {
        return {
          text: item.title,
          value: item.slug,
          object: item,
        }
      })
    })
  },

  watch: {
    'order.payment_method_slug'() {
      let installments = 0

      if (this.creating) {
        this.paymentMethods.every((item) => {
          if (item.object.slug == this.order.payment_method_slug) {
            installments = item.object.installments

            return false
          } else return true
        })
      } else {
        installments = this.order.payment_method.installments
      }

      this.installmentsAmount = []
      for (var i = 1; i <= installments; i++) {
        this.installmentsAmount.push({
          text: `${i}x`,
          value: i,
        })
      }

      if (!this.order.installments && this.installmentsAmount.length) {
        this.order.installments = this.installmentsAmount[0].value
      }
    },

    'order.shipment_cost'() {
      this.calcTotal()
    },

    'order.taxes'() {
      this.calcTotal()
    },

    'order.discount'() {
      this.calcTotal()
    },

    'order.order_products_grouped': {
      handler() {
        this.calcTotal()
      },
      deep: true
    },

    newProduct: {
      handler() {
        this.newProduct.total = parseFloat(this.newProduct.price || 0) * parseInt(this.newProduct.quantity || 0)
      },
      deep: true
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~style/vars';

$gap: 20px;

.ContentBox {
  &:not(.creating) {
    grid-template-columns: auto 1px 440px;
    grid-gap: $gap;
    grid-auto-flow: row;
  }

  .card-data.address * {
    color: $dark;
    font-size: 14px;
    line-height: 1.4;
  }

  > div {
    > :not(:first-child) {
      margin-top: $gap;
    }
  }

  .values-options {
    $gap: 10px;
    grid-column-gap: $gap;
    grid-template-columns: repeat(2, calc(17.5% - (#{$gap} / 2))) calc(30% - (2 * #{$gap})) repeat(2, calc(17.5% - (#{$gap} / 2)));
    margin-bottom: 30px;
  }

  .table-values {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
    margin-top: 20px;

    .card-data {
      margin-left: 10px;

      strong {
        font-size: 24px;
      }
    }
  }
}
</style>
