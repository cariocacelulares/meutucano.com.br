<template>
  <App>
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
          <Icon name="angle-left" />
        </TButton>

        <TButton size="big" color="light" text="darker" :link="{ name: 'products.edit' }">
          <Icon name="pencil" text="Editar" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="SKU" :value="sku" color="darker" />

        <VSeparator v-if="reference" :spacing="20" :height="40" />
        <FeaturedValue v-if="reference" label="Referência" :value="reference" color="darker" />
      </div>

      <TButton size="big" color="danger" type="submit">
        <Icon name="close" text="Excluir" />
      </TButton>
    </PageHeader>

    <ContentBox :discret="true" class="grid">
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
              <strong>{{ stock.available }} unidades</strong>
            </div>

            <div class="card-data">
              <span>Com defeito</span>
              <strong>{{ stock.defect }} unidades</strong>
            </div>

            <div class="card-data">
              <span>Baixados</span>
              <strong>{{ stock.dropped }} unidades</strong>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card header-icon="area-chart" header-text="Histórico de vendas por mês" class="sold-chart">
          <vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>
        </Card>

        <Card header-icon="money" header-text="Histórico de custo por mês">
        </Card>
      </div>

      <div>
        <Card header-icon="pie-chart" header-text="Vendas no mês por canal">
        </Card>

        <Card header-icon="shopping-cart" header-text="Última compra">
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
  </App>
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
        this.$refs.lineCharts.addSeries({
          data: this.graphs.sold
        })

        this.$refs.lineCharts.hideLoading()
    }, 1000)
  },

  data() {
    return {
      options: {
        chart: {
          height: 130,
        },
        title: false,
        yAxis: {
            title: false
        },
        legend: false,
        credits: false,
        loading: true,
        exporting: {
          enabled: false
        },
        tooltip: {
          followPointer: true,
          shared: true,
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{point.y} vendas'
        },
        xAxis: {
            categories: monthList()
        },
      },


      sku: 1384,
      title: 'Motorola Moto G 2ª Geração XT1068 8GB Preto	',
      reference: 'CA1384',
      ean: '5616515616515',
      ncm: '45645645',
      brand: 'Harman Kardon',
      line: 'Smartphones',
      unity: 'UN',
      origin: '0 - Nacional',
      condition: 'Novo',
      cost: 'R$57,54',
      value: 'R$293,90',
      stock: {
        available: 243,
        defect: 12,
        dropped: 43,
      },
      graphs: {
        sold: [
          /*1: */32,
          /*2: */41,
          /*3: */33,
          /*4: */84,
          /*5: */65,
        ],
        cost: {
          1: 32,
          2: 41,
          3: 33,
          4: 84,
          5: 65,
        },
        channel: {
          'Mercado Livre': 16,
          'E-commerce': 32,
          'B2W': 12,
          'CNOVA': 40,
        },
      },
      last_entry: {
        id: 123,
        supplier: 'Carioca Celulares Ltda Me',
        date: '09/04/2017',
        quantity: 1230,
        cost: 'R$67,23',
        total: 'R$82.692,90',
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
