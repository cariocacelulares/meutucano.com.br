<template>
  <App>
    <PageHeader>
      <div>
        <Dropdown placeholder="Linha de produtos"
          :itens="lines" name="productLines"/>
        <div class="separator">
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
      <div class="ListActions">
        <div class="pagination">
          <span>Página 1 de 1200</span>
          <TButton size="small"><Icon name="angle-left" /></TButton>
          <TButton size="small"><Icon name="angle-right" /></TButton>
          <span>|</span>
          <select>
            <option value="10">10</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          por página
          <span>|</span>
          Total de 5230 registros
        </div>
        <div class="actions">
          <TInput size="small" placeholder="Pesquisar nos produtos" />
          <TButton size="small" color="info">
            <Icon name="refresh" />&nbsp;Atualizar
          </TButton>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>EAN</th>
            <th>Produto</th>
            <th>Custo</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Estoque</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="50">Nenhum registro foi encontrado!</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colspan="50"><Icon name="refresh" :spin="true" /></td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>384</td>
            <td>9182736098231</td>
            <td>Telefone sem Fio Vtech LYRIX 550 DECT com Ramal</td>
            <td>R$943,70</td>
            <td>R$1999,90</td>
            <td>Novo</td>
            <td><span class="badge">1</span> 23</td>
            <td>
              <router-link :to="{ name: 'products.list' }">
                <Icon name="eye" />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </ContentBox>
  </App>
</template>

<script>
import { App, PageHeader, ContentBox } from 'common/layout'
import {
  Icon,
  TButton,
  TInput,
  Dropdown,
  FeaturedValue
} from 'common/components'

export default {
  components: {
    App,
    PageHeader,
    ContentBox,
    Icon,
    TButton,
    TInput,
    Dropdown,
    FeaturedValue,
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
    float: left;
    margin: 4px 0 0 20px;
    padding-left: 20px;
    border-left: 1px solid $default;
  }
}

table {
  display: none;
}
</style>
