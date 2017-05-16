<template>
  <div class="TableList">
    <div class="ListActions">
      <Pagination :namespace="namespace" />
      <form @submit.prevent="search" class="actions">
        <TInput v-model="searchTerm" size="small" placeholder="Pesquisar na listagem"
          leftIcon="search" class="m-r-10" />
        <TButton size="small" color="info" type="submit">
          <Icon name="refresh" text="Atualizar" />
        </TButton>
      </form>
    </div>

    <table border="0" align="center" :class="{ loading: loading }">
      <slot name="head"></slot>
      <tbody v-if="!data.length && !loading" class="no-results">
        <tr>
          <td colspan="50">Nenhum registro foi encontrado!</td>
        </tr>
      </tbody>
      <tbody v-if="loading" class="loading">
        <tr>
          <td colspan="50"><Icon name="refresh" :spin="true" size="giant"/></td>
        </tr>
      </tbody>
      <slot v-if="data.length" name="body"></slot>
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

    wait: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    data() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    loading() {
      return this.$store.getters['global/tableList/GET_LOADING']
    },

    stateSearchTerm() {
      return this.$store.getters['global/tableList/GET_SEARCHTERM']
    },
  },

  watch: {
    stateSearchTerm() {
      this.searchTerm = this.stateSearchTerm
    },

    wait() {
      if (!this.wait) {
        this.load()
      }
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
      return this.$store.dispatch('global/tableList/SEARCH', this.searchTerm)
    },

    pageChanged(pageAttrs) {
      this.$emit('pageChanged', pageAttrs)
    },

    load() {
      return this.wait ? [] : this.$store.dispatch('global/tableList/FETCH')
    },
  },

  mounted() {
    this.setNamespace()
    this.searchTerm = this.stateSearchTerm;

    this.load()
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.TableList {
  .ListActions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
  }

  table {
    position: relative;
    width: 100%;
    color: $darker;
    border: 1px solid $light;
    border-radius: $borderRadius;
    border-spacing: 0;

    th, td {
      border: none;
      border-collapse: collapse;
      height: 52px;
      padding: 15px 20px;
      text-align: center;
    }

    thead {
      color: $white;
      background-color: $black;
    }

    &.loading tbody:not(.loading) {
      opacity: .5;
    }

    tbody.no-results,
    tbody.loading {
      tr:hover {
        background-color: $white !important;
      }
    }

    tbody {
      &.no-results,
      &.loading {
        text-align: center;
      }

      &.loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      tr {
        transition: all linear 150ms;

        &:nth-child(2n) {
          background-color: $lighter;
        }

        &:hover {
          background-color: darken($lighter, 11) !important;
        }
      }

      a {
        color: inherit;
      }
    }
  }
}
</style>
