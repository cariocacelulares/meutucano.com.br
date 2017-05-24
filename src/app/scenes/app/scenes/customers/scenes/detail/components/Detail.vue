<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
          <Icon name="angle-left" />
        </TButton>

        <TButton size="big" color="light" text="darker" :link="{ name: 'customers.edit', params: { sku: customer.sku } }">
          <Icon name="pencil" text="Editar" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue label="Nome do cliente" :value="customer.name" color="darker" />
      </div>
    </PageHeader>

    <ContentBox :discret="true" :class="['grid', { loading }]">
      <div class="customer-info">
        <Card header-icon="user" header-text="Informações do cliente">
          <div class="card-data">
            <span>Documento</span>
            <strong v-clipboard="customer.taxvat">{{ customer.taxvat | taxvat }}</strong>
          </div>

          <div class="card-data">
            <span>E-mail de contato</span>
            <strong>{{ customer.email }}</strong>
          </div>

          <div class="card-data">
            <span>Telefone</span>
            <strong>{{ customer.phone | phone }}</strong>
          </div>
        </Card>
      </div>

      <VSeparator :spacing="0" />

      <div class="address">
        <strong>Endereços</strong>

        <Alert v-if="!customer.addresses.length" color="light" text="dark" :text-center="true">Nenhum endereço cadastrado</Alert>

        <template v-if="customer.addresses.length" v-for="address in customer.addresses">
          <Card header-icon="map-o">
            <div class="card-data">
              <span v-html="address.address"></span>
            </div>
          </Card>
        </template>
      </div>

      <VSeparator :spacing="0" />

      <div class="orders">
        <strong>Pedidos</strong>

        <Alert v-if="!customer.orders.length" color="light" text="dark" :text-center="true">Nenhum pedido para este cliente</Alert>

        <template v-if="customer.orders.length" v-for="order in customer.orders">
          <Card header-icon="cube" :header-text="order.api_code || order.id" :header-link="{ name: 'orders.detail', params: { id: order.id } }">
            <div class="grid-3">
              <div class="card-data">
                <span>Data</span>
                <strong>{{ order.created_at | date }}</strong>
              </div>

              <div class="card-data">
                <span>Canal</span>
                <strong>{{ order.marketplace.title }}</strong>
              </div>

              <Badge type="label" :color="order.status_color">{{ order.status_cast }}</Badge>
            </div>
          </Card>
        </template>
      </div>
    </ContentBox>
  </div>
</template>

<script>
import { default as CustomerTransformer } from '../../../transformer'

export default {
  props: {
    customerId: {
      default: null
    }
  },

  data() {
    return {
      customer: {
        orders: [],
        addresses: [],
      },
      loading: true,
    }
  },

  methods: {
    fetch() {
      axios.get(`customers/${this.customerId}`).then((response) => {
        this.customer = CustomerTransformer.transform(response.data)
        this.loading = false
      })
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
  grid-gap: $gap;
  grid-auto-flow: row;
  grid-template-columns: 300px 1px calc(100% - (#{$gap} * 4) - 652px) 1px 350px;

  .customer-info .card-data:not(:first-child) {
    margin-top: 20px;
  }

  > div > *:not(:first-child) {
    margin-top: $gap;
  }

  .address,
  .orders {
    > strong {
      font-size: 14px;
      color: $darker;
    }
  }

  .address .card-data span {
    font-size: 13px;
  }

  .orders {
    .Badge {
      margin-top: 4px;
    }
  }
}
</style>
