<template>
  <div class="TableList">
    <div class="ListActions">
      <Pagination :rows="data.length" />
      <div class="actions">
        <TInput size="small" placeholder="Pesquisar nos produtos" leftIcon="search" />
        <TButton size="small" color="info">
          <Icon name="refresh" />&nbsp; Atualizar
        </TButton>
      </div>
    </div>

    <table border="0" align="center">
      <thead>
        <tr>
          <th>SKU</th>
          <th>EAN</th>
          <th class="text-left">Produto</th>
          <th>Custo</th>
          <th>Valor</th>
          <th>Estado</th>
          <th>Estoque</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="no-results">
        <tr>
          <td colspan="50">Nenhum registro foi encontrado!</td>
        </tr>
      </tbody>
      <tbody class="loading">
        <tr>
          <td colspan="50"><Icon name="refresh" :spin="true" /></td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>384</td>
          <td>9182736098231</td>
          <td class="text-left">Telefone sem Fio Vtech LYRIX 550 DECT com Ramal</td>
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
        <tr>
          <td>384</td>
          <td>9182736098231</td>
          <td class="text-left">Telefone sem Fio Vtech LYRIX 550 DECT com Ramal</td>
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
        <tr>
          <td>384</td>
          <td>9182736098231</td>
          <td class="text-left">Telefone sem Fio Vtech LYRIX 550 DECT com Ramal</td>
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
  </div>
</template>

<script>
import {
  TButton,
  Icon,
  VSeparator,
  TSelect,
  TInput,
} from './'
import {
  Pagination,
} from './tableList'

export default {
  components: {
    TButton,
    Icon,
    TInput,
    Pagination,
  },

  data() {
    return {
      loading: false,
      data: [],
    }
  },

  methods: {
    load() {
      this.loading = true

      var promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
          })
        }, 1000)
      });

      return promise
    }
  },

  mounted() {
    this.load().then((response) => {
      this.data = response.data
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style lang="scss">
@import '~style/vars';

.ListActions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
}

table {
  width: 100%;
  color: $darker;
  border: 1px solid $light;
  border-radius: 3px;
  border-spacing: 0;

  th, td {
    border: none;
    border-collapse: collapse;
    height: 52px;
    padding: 15px;
    text-align: center;
  }

  thead {
    color: $white;
    background-color: $black;
  }

  tbody {
    &.no-results,
    &.loading {
      text-align: center;
    }

    tr:nth-child(2n) {
      background-color: $ligther;
    }
  }
}
</style>
