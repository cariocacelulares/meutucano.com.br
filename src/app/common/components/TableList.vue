<template>
  <div class="TableList">
    <div class="ListActions">
      <Pagination :namespace="namespace" />
      <form @submit.prevent="search" class="actions">
        <TInput v-model="searchTerm" size="small" :placeholder="searchText" leftIcon="search" />
        <TButton size="small" color="info" type="submit">
          <Icon name="refresh" />&nbsp; Atualizar
        </TButton>
      </form>
    </div>

    <table border="0" align="center">
      <slot name="head"></slot>
      <tbody v-if="!data.length && !loading" class="no-results">
        <tr>
          <td colspan="50">Nenhum registro foi encontrado!</td>
        </tr>
      </tbody>
      <tbody v-if="loading" class="loading">
        <tr>
          <td colspan="50"><Icon name="refresh" :spin="true" /></td>
        </tr>
      </tbody>
      <slot v-if="data.length && !loading" name="body"></slot>
    </table>
  </div>
</template>

<script>
import {
  TButton,
  Icon,
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

  props: {
    namespace: {
      type: String,
      required: true
    },
    searchText: {
      type: String,
      default: 'Pesquisar'
    }
  },

  computed: {
    data() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    loading() {
      return this.$store.getters['global/tableList/GET_LOADING']
    },
  },

  watch: {
    data(data) {
      this.changeRows(data.length)
    }
  },

  data() {
    return {
      searchTerm: null
    }
  },

  methods: {
    setNamespace() {
      return this.$store.dispatch('global/SET_NAMESPACE', this.namespace)
    },

    search() {
      return this.$store.dispatch(`${this.namespace}/SEARCH`)
    },

    changeRows(rows) {
      return this.$store.dispatch('global/tableList/CHANGE_ROWS', rows)
    },

    pageChanged(pageAttrs) {
      this.$emit('pageChanged', pageAttrs)
    }
  },

  mounted() {
    this.setNamespace()
  }
}
</script>

<style lang="scss" scoped>
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
