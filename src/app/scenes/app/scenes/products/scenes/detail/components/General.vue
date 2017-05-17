<template>
  <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
    <div>
      <Card header-icon="info" header-text="Detalhes">
        <div class="card-data">
          <span>Título</span>
          <strong>{{ product.title }}</strong>
        </div>

        <div class="grid-3 m-t-20">
          <div class="card-data">
            <span>EAN</span>
            <strong>{{ product.ean || 'N/A' }}</strong>
          </div>

          <div class="card-data">
            <span>Marca</span>
            <strong>{{ product.brand ? product.brand.title : '' }}</strong>
          </div>

          <div class="card-data">
            <span>Linha</span>
            <strong>{{ product.line ? product.line.title : '' }}</strong>
          </div>

          <div class="card-data">
            <span>NCM</span>
            <strong>{{ product.ncm }}</strong>
          </div>

          <div class="card-data">
            <span>Tipo de unidade</span>
            <strong>{{ product.unity_type }}</strong>
          </div>

          <div class="card-data">
            <span>Origem</span>
            <strong>{{ product.origin }}</strong>
          </div>

          <div class="card-data">
            <span>Condição</span>
            <strong>{{ product.condition_cast }}</strong>
          </div>

          <div class="card-data">
            <span>Custo</span>
            <strong>{{ product.cost | money }}</strong>
          </div>

          <div class="card-data">
            <span>Valor</span>
            <strong>{{ product.price | money }}</strong>
          </div>
        </div>
      </Card>

      <Card header-icon="info" header-text="Estoque">
        <div class="grid-3">
          <div class="card-data">
            <span>Em estoque</span>
            <strong>{{ product.available_stock }}</strong>
          </div>

          <div class="card-data">
            <span>Com defeito</span>
            <strong>{{ product.defects }}</strong>
          </div>

          <div class="card-data">
            <span>Baixados</span>
            <strong>{{ product.issues }}</strong>
          </div>
        </div>
      </Card>
    </div>

    <div>
      <Card header-icon="area-chart" header-text="Histórico de vendas por mês" :loading="loading">
        <vue-highcharts :options="ordersPeriodOptions" ref="ordersPeriod"></vue-highcharts>
      </Card>

      <Card header-icon="money" header-text="Histórico de custo por mês" :loading="loading">
        <vue-highcharts :options="costPeriodOptions" ref="costPeriod"></vue-highcharts>
      </Card>
    </div>

    <div>
      <Card header-icon="pie-chart" header-text="Vendas no mês por canal" :loading="loading"
        :header-margin-bottom="10" class="p-b-10">
        <vue-highcharts :options="ordersMarketplaceOptions" ref="ordersMarketplace"></vue-highcharts>
      </Card>

      <Card v-if="last_entry.date" header-icon="shopping-cart" header-text="Última compra">
        <div slot="header">
          <router-link :to="{ name: 'products.detail' }">
            <Icon name="eye" text="Ver entrada" />
          </router-link>
        </div>

        <div class="card-data">
          <span>Fornecedor</span>
          <strong>{{ last_entry.supplier.name }}</strong>
        </div>

        <div class="grid-2 m-t-20">
          <div class="card-data">
            <span>Data</span>
            <strong>{{ last_entry.date | dateTime }}</strong>
          </div>

          <div class="card-data">
            <span>Quantidade</span>
            <strong>{{ last_entry.quantity }}</strong>
          </div>

          <div class="card-data">
            <span>Custo</span>
            <strong>{{ last_entry.cost | money }}</strong>
          </div>

          <div class="card-data">
            <span>Total</span>
            <strong>{{ last_entry.total | money }}</strong>
          </div>
        </div>

      </Card>
    </div>
  </ContentBox>
</template>

<script>
export default {
  mounted() {
    // product detail
    axios.get(`products/${this.sku}`).then(
      (response) => {
        this.loading = false
        this.product = response.data
      },
      (error) => {
        console.log(error)
      }
    )

    // last entry
    axios.get(`products/${this.sku}/entry`).then(
      (response) => {
        this.last_entry = response.data
      },
      (error) => {
        console.log(error)
      }
    )

    // graph: orders per month
    axios.get(`products/${this.sku}/graph/orders-period`).then(
      (response) => {
        let series = []
        let categories = []
        response.data.forEach((item) => {
          series.push(item.quantity)
          categories.push(item.month)
        })

        this.$refs.ordersPeriod.chart.xAxis[0].categories = categories
        this.$refs.ordersPeriod.addSeries({
          data: series
        })

        this.$refs.ordersPeriod.hideLoading()
      },
      (error) => {
        console.log(error)
      }
    )

    // graph: cost per month
    axios.get(`products/${this.sku}/graph/cost-period`).then(
      (response) => {
        let series = []
        let categories = []
        response.data.forEach((item) => {
          series.push(item.quantity)
          categories.push(item.month)
        })

        this.$refs.costPeriod.chart.xAxis[0].categories = categories
        this.$refs.costPeriod.addSeries({
          data: series
        })

        this.$refs.costPeriod.hideLoading()
      },
      (error) => {
        console.log(error)
      }
    )

    // graph: cost per month
    axios.get(`products/${this.sku}/graph/orders-marketplace`).then(
      (response) => {

        let series = []
        response.data.forEach((item) => {
          series.push({
            name: item.marketplace,
            y: item.percent,
          })
        })

        this.$refs.ordersMarketplace.addSeries({
          data: series
        })

        this.$refs.ordersMarketplace.hideLoading()
      },
      (error) => {
        console.log(error)
      }
    )
  },

  data() {
    const costPeriodOptions = _.cloneDeep(lineChartOptions)
    costPeriodOptions.plotOptions.line.dataLabels.format = 'R${y}'

    return {
      ordersPeriodOptions: lineChartOptions,
      costPeriodOptions: costPeriodOptions,
      ordersMarketplaceOptions: pieChartOptions,

      loading: true,

      product: {},
      stock: {},
      last_entry: {},

      graphs: {
        sold: [],
        cost: [],
        channel: [],
      },
    }
  },

  computed: {
    sku() {
      return this.$route.params.sku
    }
  }
}
</script>

<style lang="scss" scoped>
$gap: 20px;

.ContentBox {
  grid-template-columns: repeat(2, calc((500 * (100% - (#{$gap} / 2))) / 1400))  calc((360 * 100%) / 1400);
  grid-gap: $gap;
  grid-auto-flow: row;

  > div > *:not(:first-child) {
    margin-top: $gap;
  }
}
</style>
