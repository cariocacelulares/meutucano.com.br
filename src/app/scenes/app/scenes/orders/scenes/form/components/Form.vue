<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <template v-if="!creating">
          <FeaturedValue :label="order.marketplace" :value="order.api_code" color="darker" />

          <VSeparator :spacing="20" :height="40" />
          <Badge type="label" color="primary">Aprovado</Badge>
        </template>

        <FeaturedValue v-else label="" value="Criação de um novo pedido" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="creating" :discret="true" :class="{ grid: true, creating, loading: loading }">
      <div>
        <Card header-icon="user" header-text="Informações do cliente">
          <div v-if="true" class="grid-2">
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

            <TSelect label="Endereço" :placeholder="'Selecione um ' + (customer ? 'endereço' : 'cliente')"
              :options="addressList" />
          </div>

          <div v-if="!creating" class="grid-2">
            <div class="card-data">
              <span>Nome do cliente</span>
              <strong>Cleiton Souza</strong>
            </div>

            <div class="card-data">
              <span>Documento</span>
              <strong>100.456.752-45</strong>
            </div>

            <div>
              <div class="card-data">
                <span>E-mail de contato</span>
                <strong>cleiton7souza@gmail.com</strong>
              </div>

              <div class="card-data span-2 m-t-20">
                <span>Telefone</span>
                <strong>(47) 3521-3183<!--b><br/>(47) 98898-3927</b--></strong>
              </div>
            </div>

            <div class="card-data address">
              <span>
                Rua Padre Anchieta #200 - Canoas<br/>
                Rio do Sul / SC<br/>
                89160-000<br/>
                Sala 201
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <table class="discrete-table">
            <thead>
              <tr>
                <th width="125">SKU</th>
                <th class="text-left">Produto</th>
                <th width="147">Preço</th>
                <th width="105">Qtd</th>
                <th>Subtotal</th>
                <th width="12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products">
                <td>
                  <InputGroup size="small">
                    <Icon name="search" slot="left" />
                    <TInput v-model="product.sku" slot="input" />
                  </InputGroup>
                </td>
                <td class="text-left">{{ product.title }}</td>
                <td>
                  <InputGroup size="small">
                    <Icon name="usd" slot="left" />
                    <TInput v-model="product.price" slot="input" />
                  </InputGroup>
                </td>
                <td>
                  <TInput v-model="product.quantity" size="small" type="number" :min="1"/>
                </td>
                <td>{{ product.total }}</td>
                <td>
                  <Icon name="close" color="danger" />
                </td>
              </tr>
              <tr>
                <td>
                  <ProductSearch v-model="newProduct" />
                </td>
                <td class="text-left">
                  {{ newProduct.title }}
                  <span v-if="!newProduct.sku" class="text-dark">Adicionar produto</span>
                </td>
                <td>
                  <InputGroup v-if="newProduct.sku" size="small">
                    <Icon name="usd" slot="left" />
                    <TInput v-model="newProduct.price" slot="input" />
                  </InputGroup>
                </td>
                <td>
                  <TInput v-if="newProduct.sku" v-model="newProduct.quantity" size="small" type="number" :min="1"/>
                </td>
                <td>{{ newProduct.total }}</td>
                <td>
                  <Icon v-if="newProduct.sku" name="plus" color="success" />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="table-values">
            <Help side="right" title="Valor formado pela soma do subtotal, frete e taxas subtraído pelo desconto aplicado" />

            <div class="card-data">
              <span>Valor Total</span>
              <strong>R$1567,90</strong>
            </div>
          </div>
        </Card>
      </div>

      <VSeparator v-if="id" :spacing="0" />

      <div v-if="id">
        <CommentsBox :form="false" :only-important="true" />
      </div>
    </ContentBox>
  </form>
</template>

<script>
export default {
  props: {
    orderId: {
      default: null,
    },
  },

  data() {
    return {
      order: {},
      customer: null,
      customerList: [],
      addressList: [],
      products: [],

      newProduct: {
        sku: null,
        title: null,
        price: null,
        quantity: null,
        total: null,
      },

      loading: false,
    }
  },

  computed: {
    id() {
      return this.orderId
    },

    creating() {
      return !this.orderId ? true : false
    }
  },

  methods: {
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

      this.customer = customer

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

    generateSku() {
      this.id = 384
    },

    save() {
      axios.post('order/create', this.$data).then(
        (response) => {
          if (validationFail(response)) {
            console.log('validationFail', response.data)
          } else {
            this.$router.push({ name: 'orders.list' })
          }
        },
        (error) => {
          this.$toaster.error('Não foi possível salvar o salvar produto!')
        }
      )
    },
  },

  beforeRouteEnter(to, from, next) {
    //if (to.name == 'orders.create') {
      next()
    /*} else {
      axios.get('order/' + to.params.id).then(
        (response) => {
          next()
        },
        (error) => {
          next({ name: 'orders.list' })
        }
      )
    }*/
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
