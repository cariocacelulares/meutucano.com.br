<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Mercado Livre"
          value="03-102973901" color="darker" />

        <VSeparator :spacing="20" :height="40" />
        <TLabel color="primary">Aprovado</TLabel>
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
      <div>
        <Card header-icon="user" header-text="Informações do cliente">
          <div v-if="true" class="grid-2">
            <TSelect label="Cliente" placeholder="Selecione um cliente" :options="[
              {
                value: 1,
                text: 'Aprovado'
              },
              {
                value: 2,
                text: 'Cancelado'
              },
            ]" />

            <TSelect label="Endereço" placeholder="Selecione um cliente" :options="[
              {
                value: 1,
                text: 'Aprovado'
              },
              {
                value: 2,
                text: 'Cancelado'
              },
            ]" />
          </div>

          <div v-if="false" class="grid-2">
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
            </tbody>
          </table>

          <div class="table-values">
            <label>Status</label>
            <TSelect :options="[
              {
                value: 1,
                text: 'Aprovado'
              },
              {
                value: 2,
                text: 'Cancelado'
              },
            ]" />

            <VSeparator :spacing="20" color="light" />

            <div class="card-data">
              <span>Valor Total</span>
              <strong>R$1567,90</strong>
            </div>

            <Help title="Valor formado pela soma do subtotal, frete e taxas subtraído pelo desconto aplicado" />
          </div>
        </Card>
      </div>

      <VSeparator :spacing="0" />

      <div>
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
    }
  },

  data() {
    return {
      loading: false,

      products: [
        {
          sku: 384,
          title: 'Alcatel Pixi4 Colors Azul',
          price: 119.90,
          quantity: 2,
          total: 200.52,
        },
      ],
    }
  },

  computed: {
    id() {
      return this.orderId
    },
  },

  methods: {
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
  grid-template-columns: auto 1px 440px;
  grid-gap: $gap;
  grid-auto-flow: row;

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
    height: 40px;
    margin-top: 20px;

    label {
      margin-right: 10px;
      font-weight: bold;
      font-size: 14px;
    }

    .card-data {
      margin-right: 10px;

      strong {
        font-size: 24px;
      }
    }
  }
}
</style>
