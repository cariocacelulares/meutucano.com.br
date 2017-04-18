<template>
  <App>
    <PageHeader>
      <div>
        <Dropdown placeholder="Linha de produtos"
          :itens="lines" name="productLines"/>
        <div class="separator">
          <VSeparator :spacing="20" :height="40" />
          <FeaturedValue label="Em estoque (144)"
          value="R$133.619,00" color="success" />
        </div>
      </div>

      <TButton size="big" color="success">
        <Icon name="plus" />
        &nbsp; Novo produto
      </TButton>
    </PageHeader>
    <ContentBox>
      <TableList />
    </ContentBox>
  </App>
</template>

<script>
import { App, PageHeader, ContentBox } from 'common/layout'
import {
  Dropdown,
  FeaturedValue,
  TButton,
  Icon,
  VSeparator,
  TableList,
} from 'common/components'

export default {
  components: {
    App,
    PageHeader,
    ContentBox,
    Dropdown,
    FeaturedValue,
    TButton,
    Icon,
    VSeparator,
    TableList,
  },

  computed: {
    lines() {
      return [
        {
          label: 'Item a',
          value: 1
        },
        {
          label: 'Item b',
          value: 2
        },
        {
          label: 'Item c',
          value: 3
        },
      ]
    }
  },

  mounted() {
    this.$root.$on('dropdownChanged.productLines', (item) => {
      // alguma ação pra quando troca a linha dos produtos
      console.log(item);
    })
  },

  beforeDestroy () {
    this.$root.$off('dropdownChanged.productLines')
  }
};
</script>

<style lang="scss" scoped>
@import '~style/vars';

.page-header {
  .separator {
    display: flex;
    align-items: center;
  }
}
</style>
