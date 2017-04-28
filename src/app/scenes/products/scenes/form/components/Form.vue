<template>
  <App>
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="SKU"
        value="1384" color="darker" />
      </div>

      <TButton size="big" color="success" @click="save">
        <Icon name="check" />
        &nbsp; Salvar
      </TButton>
    </PageHeader>
    <ContentBox :boxed="true">
      <form @submit.prevent="save">
        <div class="grid-5">
          <TInput v-model="sku" label="SKU" placeholder="Cód. único" />
          <TInput v-model="title" label="Título" placeholder="Ex: Iphone 6S Plus Dourado" class="span-4" />

          <TInput v-model="reference" label="Referência" placeholder="Ref. do produto" />
          <TInput v-model="ean" label="EAN" placeholder="Cód. de barras" />
          <TInput v-model="ncm" label="NCM" placeholder="Nomenclatura Comum do MERCOSUL " />
          <TSelect v-model="brand" :options="[]" label="Marca" placeholder="Selecione" />
          <TSelect v-model="line" :options="[]" label="Linha" placeholder="Selecione" />

          <TSelect v-model="unity" :options="[]" label="Tipo de unidade" placeholder="Selecione" />
          <TSelect v-model="condition" :options="[]" label="Condição" placeholder="Selecione" />
        </div>

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
      </form>
    </ContentBox>
  </App>
</template>

<script>
import { App, PageHeader, ContentBox } from 'common/layout'
import {
  Icon,
  TButton,
  VSeparator,
  FeaturedValue,
  TLabel,
  TInput,
  TSelect,
  HSeparator,
  Help,
} from 'common/components'

export default {
  components: {
    App,
    PageHeader,
    ContentBox,
    Icon,
    TButton,
    VSeparator,
    FeaturedValue,
    TLabel,
    TInput,
    TSelect,
    HSeparator,
    Help,
  },

  data() {
    return {
      sku: null,
      title: null,
      reference: null,
      ean: null,
      ncm: null,
      brand: null,
      line: null,
      unity: null,
      condition: null,
      stock_time: null,
      stock_min: null,
      stock_max: null,
    }
  },

  methods: {
    save() {
      axios.post('product/create', this.$data)
        .then(
          (response) => {
            this.$router.push({ name: 'products.list' })
          },
          (error) => {
            this.$toaster.error('Não foi possível salvar o salvar produto!')
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
