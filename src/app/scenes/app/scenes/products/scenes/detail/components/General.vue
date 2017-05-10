<template>
  <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
    <div>
      <Card header-icon="info" header-text="Detalhes">
        <div class="card-data">
          <span>Título</span>
          <strong>{{ title }}</strong>
        </div>

        <div class="grid-3 m-t-20">
          <div class="card-data">
            <span>EAN</span>
            <strong>{{ ean }}</strong>
          </div>

          <div class="card-data">
            <span>Marca</span>
            <strong>{{ brand }}</strong>
          </div>

          <div class="card-data">
            <span>Linha</span>
            <strong>{{ line }}</strong>
          </div>

          <div class="card-data">
            <span>NCM</span>
            <strong>{{ ncm }}</strong>
          </div>

          <div class="card-data">
            <span>Tipo de unidade</span>
            <strong>{{ unity }}</strong>
          </div>

          <div class="card-data">
            <span>Origem</span>
            <strong>{{ origin }}</strong>
          </div>

          <div class="card-data">
            <span>Condição</span>
            <strong>{{ condition }}</strong>
          </div>

          <div class="card-data">
            <span>Custo</span>
            <strong>{{ cost }}</strong>
          </div>

          <div class="card-data">
            <span>Valor</span>
            <strong>{{ value }}</strong>
          </div>
        </div>
      </Card>

      <Card header-icon="info" header-text="Estoque">
        <div class="grid-3">
          <div class="card-data">
            <span>Em estoque</span>
            <strong>{{ stock.available }}</strong>
          </div>

          <div class="card-data">
            <span>Com defeito</span>
            <strong>{{ stock.defect }}</strong>
          </div>

          <div class="card-data">
            <span>Baixados</span>
            <strong>{{ stock.dropped }}</strong>
          </div>
        </div>
      </Card>
    </div>

    <div>
      <Card header-icon="area-chart" header-text="Histórico de vendas por mês" :loading="loading">
        <vue-highcharts :options="salesHistoryOptions" ref="salesHistory"></vue-highcharts>
      </Card>

      <Card header-icon="money" header-text="Histórico de custo por mês" :loading="loading">
        <vue-highcharts :options="costHistoryOptions" ref="costHistory"></vue-highcharts>
      </Card>
    </div>

    <div>
      <Card header-icon="pie-chart" header-text="Vendas no mês por canal" :loading="loading"
        :header-margin-bottom="10" class="p-b-10">
        <vue-highcharts :options="channelSalesOptions" ref="channelSales"></vue-highcharts>
      </Card>

      <Card header-icon="shopping-cart" header-text="Última compra">
        <div slot="header">
          <router-link :to="{ name: 'products.detail' }">
            <Icon name="eye" text="Ver entrada" />
          </router-link>
        </div>

        <div class="card-data">
          <span>Fornecedor</span>
          <strong>{{ last_entry.supplier }}</strong>
        </div>

        <div class="grid-2 m-t-20">
          <div class="card-data">
            <span>Data</span>
            <strong>{{ last_entry.date }}</strong>
          </div>

          <div class="card-data">
            <span>Quantidade</span>
            <strong>{{ last_entry.quantity }}</strong>
          </div>

          <div class="card-data">
            <span>Custo</span>
            <strong>{{ last_entry.cost }}</strong>
          </div>

          <div class="card-data">
            <span>Total</span>
            <strong>{{ last_entry.total }}</strong>
          </div>
        </div>

      </Card>
    </div>
  </ContentBox>
</template>

<script>
import VueHighcharts from 'vue2-highcharts'

export default {
  components: {
    VueHighcharts
  },

  props: {
  },

  mounted() {
    setTimeout(() => {
        this.loading = false

        this.sku = 1384
        this.title = 'Motorola Moto G 2ª Geração XT1068 8GB Preto'
        this.reference = 'CA1384'
        this.ean = '5616515616515'
        this.ncm = '45645645'
        this.brand = 'Harman Kardon'
        this.line = 'Smartphones'
        this.unity = 'UN'
        this.origin = '0 - Nacional'
        this.condition = 'Novo'
        this.cost = 'R$57,54'
        this.value = 'R$293,90'
        this.stock = {
          available: '243 unidades',
          defect: '12 unidades',
          dropped: '43 unidades',
        }

        this.graphs.sold = [32, 41, 33, 84, 65]
        this.graphs.cost = [12, 21, 8, 18, 33]
        this.graphs.channel = [
          {
            name: 'Mercado Livre',
            y: 16,
            color: '#584FF1',
          },
          {
            name: 'E-commerce',
            y: 32,
            color: '#AB00C3',
          },
          {
            name: 'B2W',
            y: 12,
            color: '#00E5CB',
          },
          {
            name: 'CNOVA',
            y: 40,
            color: '#F5E135',
          },
        ]

        this.last_entry = {
          id: 123,
          supplier: 'Carioca Celulares Ltda Me',
          date: '09/04/2017',
          quantity: 1230,
          cost: 'R$67,23',
          total: 'R$82.692,90',
        }

        this.$refs.salesHistory.addSeries({
          data: this.graphs.sold
        })

        this.$refs.salesHistory.hideLoading()

        this.$refs.costHistory.addSeries({
          data: this.graphs.cost
        })

        this.$refs.costHistory.hideLoading()

        this.$refs.channelSales.addSeries({
          data: this.graphs.channel
        })

        this.$refs.channelSales.hideLoading()
    }, 1000)
  },

  data() {
    const lineChartOptions = {
      chart: {
        height: 130,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
      },
      title: false,
      yAxis: {
        title: false,
        visible: false,
      },
      legend: false,
      credits: false,
      loading: true,
      exporting: {
        enabled: false
      },
      xAxis: {
        categories: monthList(),
        tickLength: 10,
        labels: {
          style: {
            color: '#999',
            cursor: 'default',
            fontSize: '11px',
          }
        }
      },
      plotOptions: {
        line: {
          size:'100%',
          color: '#6D5CAE',
          dataLabels: {
            enabled: true,
            y: -1,
            inside: true,
            style: {
              color: '#666',
              fontSize: '11px',
              fontWeight: 'normal',
              textOutline: 'none',
              cursor: 'default',
            },
          },
          enableMouseTracking: false
        }
      },
    }

    const costHistoryOptions = _.cloneDeep(lineChartOptions)
    costHistoryOptions.plotOptions.line.dataLabels.format = 'R${y}'

    const channelSalesOptions = {
      chart: {
        type: 'pie',
        height: 150,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        // marginRight: 0,
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
      },
      title: false,
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginBottom: 5,
        symbolRadius: 3,
        itemStyle: {
          color: '#999',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'normal',
        },
      },
      credits: false,
      loading: true,
      exporting: {
        enabled: false
      },
      plotOptions: {
        pie: {
          size:'100%',
          slicedOffset: 0,
          enableMouseTracking: false,
          dataLabels: {
            distance: -20,
            inside: true,
            format: '{y}%',
            style: {
              color: '#FFF',
              fontSize: '12px',
              fontWeight: 'bold',
              textOutline: 'none',
              cursor: 'default',
            },
          },
          showInLegend: true
        }
      },
    }

    return {
      salesHistoryOptions: lineChartOptions,
      costHistoryOptions: costHistoryOptions,
      channelSalesOptions: channelSalesOptions,

      loading: true,

      sku: null,
      title: null,
      reference: null,
      ean: null,
      ncm: null,
      brand: null,
      line: null,
      unity: null,
      origin: null,
      condition: null,
      cost: null,
      value: null,
      stock: {
        available: null,
        defect: null,
        dropped: null,
      },
      graphs: {
        sold: [],
        cost: [],
        channel: [],
      },
      last_entry: {
        id: null,
        supplier: null,
        date: null,
        quantity: null,
        cost: null,
        total: null,
      },
    }
  },

  computed() {
  },

  beforeRouteEnter(to, from, next) {
    // if (to.name == 'products.create') {
      next()
    /*} else {
      axios.get('product/' + to.params.sku).then(
        (response) => {
          next()
        },
        (error) => {
          next({ name: 'products.list' })
        }
      )
    }*/
  },
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
