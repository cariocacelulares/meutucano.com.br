<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue v-if="!creating" label="SKU" :value="product.sku" color="darker" />

        <FeaturedValue v-else label="" value="Criar um novo produto" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="true">
      <ValidationBox class="m-b-20" />

      <div class="grid-4 m-b-20">
        <TInput v-model="product.sku" label="SKU" placeholder="Cód. único" slot="input" class="shrink-1" :disabled="true" />
        <TInput v-model="product.title" label="Título" placeholder="Ex: Iphone 6S Plus Dourado" class="span-3" />
      </div>

      <div class="grid-5">
        <TInput v-model="product.reference" label="Referência" placeholder="Ref. do produto" />
        <TInput v-model="product.ean" label="EAN" placeholder="Cód. de barras" />
        <TInput v-model="product.ncm" label="NCM" placeholder="Nomenclatura Comum do MERCOSUL " />
        <TLabel text="Marca">
          <v-select theme="discrete" :inside-search="true"
            :on-search="getBrands"
            :options="brands"
            :on-change="brandChanged"
            :value.sync="product.brand_option"
            placeholder="Marca do produto"
            search-placeholder="Buscar marca">
            <template slot="no-options">Nada foi encontrado</template>
          </v-select>
        </TLabel>
        <TLabel text="Linha">
          <v-select theme="discrete" :inside-search="true"
            :on-search="getLines"
            :options="lines"
            :on-change="lineChanged"
            :value.sync="product.line_option"
            placeholder="Linha do produto"
            search-placeholder="Buscar linha">
            <template slot="no-options">Nada foi encontrado</template>
          </v-select>
        </TLabel>

        <TSelect v-model="product.unity_type" :options="unityTypes" label="Tipo de unidade" placeholder="Selecione" />

        <TSelect v-model="product.condition" :options="conditions" label="Condição" placeholder="Selecione" />

        <TSelect v-model="product.origin" :options="origins" label="Origem" placeholder="Selecione" />

        <TInput v-model="product.warranty" label="Garantia" placeholder="Ex: 3 meses"/>

        <TLabel text="Preço">
          <InputGroup>
            <Icon name="usd" slot="left" />
            <TInput v-model="product.price" placeholder="R$ 999,90" slot="input" />
          </InputGroup>
        </TLabel>
      </div>

      <!--
      <HSeparator :spacing="20" />

      <div class="clear">
        <TInput v-model="stock_time" type="number" label="Tempo máximo em estoque (dias)"
          placeholder="Ilimitado" class="start-1" />
        <Help class="span-3"
          title="Uma notificação será disparada quando o produto exceder o limite de tempo no estoque."
          message="Os destinatários dessa notificação podem ser configurados em Configurações." />
      </div>

      <div class="clear">
        <TInput v-model="stock_min" type="number" label="Quantidade mínima em estoque"
          placeholder="Ilimitado" class="start-1" />
      </div>

      <div class="clear">
        <TInput v-model="stock_max" type="number" label="Quantidade máxima em estoque"
          placeholder="Ilimitado" class="start-1" />
        <Help class="span-3"
          title="Uma notificação será disparada quando o estoque do produto estiver acima no máximo."
          message="Os destinatários dessa notificação podem ser configurados em Configurações." />
      </div>
      -->
    </ContentBox>
  </form>
</template>

<script>
export default {
  props: {
    productSku: {
      default: null
    }
  },

  data() {
    return {
      product: {
        brand: {},
        line: {},
        condition: null,
      },

      lines: [],
      brands: [],

      unityTypes: [
        {
          text: 'Unidade',
          value: 'UN',
        }
      ],

      conditions: [
        {
          text: 'Novo',
          value: 0,
        },
        {
          text: 'Usado',
          value: 1,
        },
      ],

      origins: [
        {
          text: 'Nacional',
          value: 0,
        },
        {
          text: 'Importado',
          value: 1,
        },
      ],
      /*stock_time: null,
      stock_min: null,
      stock_max: null,*/
    }
  },

  computed: {
    creating() {
      return (typeof(this.productSku) != 'undefined' && this.productSku) ? false : true
    },
  },

  methods: {
    lineChanged(line) {
      if (line) {
        this.product.line_id = line.value
      }
    },

    getLines(search, loading) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        loading(true)

        axios.get('lines/fetch' + parseParams({ search })).then(
          (response) => {
            this.lines = []

            response.data.forEach((item) => {
              this.lines.push({
                label: item.title,
                value: item.id
              })
            })

            loading(false)
          }
        )
      }.bind(this), 500)
    },

    brandChanged(brand) {
      if (brand) {
        this.product.brand_id = brand.value
      }
    },

    getBrands(search, loading) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        loading(true)

        axios.get('brands/fetch' + parseParams({ search })).then(
          (response) => {
            this.brands = []

            response.data.forEach((item) => {
              this.brands.push({
                label: item.title,
                value: item.id
              })
            })

            loading(false)
          }
        )
      }.bind(this), 500)
    },

    save() {
      if (this.creating) {
        axios.post('products', this.product).then((response) => {
          this.$router.push({ name: 'products.detail', params: { sku: response.data.sku } })
          this.$toaster.success('Produto criado com sucesso!')
        })
      } else {
        axios.put(`products/${this.product.sku}`, this.product).then((response) => {
          this.$router.push({ name: 'products.detail', params: { sku: response.data.sku } })
          this.$toaster.success('Produto alterado com sucesso!')
        })
      }
    },
  },

  beforeMount() {
    this.$store.dispatch('global/VALIDATION')

    if (typeof(this.$route.params.sku) !== 'undefined') {
      axios.get(`products/${this.$route.params.sku}`).then(
        (response) => {
          this.product = Object.assign(this.product, response.data)

          if (!this.productSku) { // is creating
            delete this.product.sku
            this.product.title += ' (duplicado)'
          }

          if (this.product.line) {
            this.product.line_option = {
              label: this.product.line.title,
              value: this.product.line.id
            }
            this.lines = [this.product.line_option]
          }

          if (this.product.brand) {
            this.product.brand_option = {
              label: this.product.brand.title,
              value: this.product.brand.id
            }
            this.brands = [this.product.brand_option]
          }
        },
        (error) => {
          this.$router.push({ name: 'products.list' })
        }
      )
    }
  },
};
</script>

<style lang="scss" scoped>
.clear {
  &:not(:last-child) {
    margin-bottom: 20px;
  }

  .inputWrapper {
    width: 30%;
  }
}
</style>
