<template>
  <div class="Pagination">
    <span>Página {{ page.current }} de {{ page.total }}</span>
    <div class="controls">
      <TButton @click="firstPage" :disabled="loading || (page.current == 1 || page.current == 2)"
        size="small" color="light" text="darker">
        <Icon name="angle-double-left" />
      </TButton>
      <TButton @click="prevPage" :disabled="loading || (page.current == 1)"
        size="small" color="light" text="darker">
        <Icon name="angle-left" />
      </TButton>
      <TButton @click="nextPage" :disabled="loading || (page.current == page.total)"
        size="small" color="light" text="darker">
        <Icon name="angle-right" />
      </TButton>
      <TButton @click="lastPage" :disabled="loading || (page.current == page.total || page.current == (page.total - 1))"
        size="small" color="light" text="darker">
        <Icon name="angle-double-right" />
      </TButton>
    </div>
    <VSeparator :height="30" />
    Mostrar
    <TSelect v-model="perPage" :options="options"
      size="small" class="m-h-10" @input="changePerPage" />
    por página
    <VSeparator :height="30" />
    Total de {{ rows }} registro{{ (rows !== 1) ? 's' : '' }}
  </div>
</template>

<script>
import {
  TButton,
  Icon,
  VSeparator,
  TSelect,
} from '../'

export default {
  components: {
    TButton,
    Icon,
    VSeparator,
    TSelect,
  },

  props: {
    namespace: {
      type: String,
      required: true
    },
  },

  computed: {
    loading() {
      return this.$store.getters['global/tableList/GET_LOADING']
    },

    rows() {
      return this.$store.getters['global/tableList/GET_ROWS']
    },

    page() {
      return this.$store.getters['global/tableList/GET_PAGE']
    },

    perPage() {
      return this.$store.getters['global/tableList/GET_PERPAGE']
    },

    options() {
      return [
        { text: '10', value: 10 },
        { text: '30', value: 30 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
      ]
    },
  },

  methods: {
    firstPage() {
      return this.$store.dispatch('global/tableList/FIRST_PAGE')
    },

    prevPage() {
      return this.$store.dispatch('global/tableList/PREV_PAGE')
    },

    nextPage() {
      return this.$store.dispatch('global/tableList/NEXT_PAGE')
    },

    lastPage() {
      return this.$store.dispatch('global/tableList/LAST_PAGE')
    },

    changePerPage(amount) {
      return this.$store.dispatch('global/tableList/CHANGE_PERPAGE', amount)
    },

    configPagination() {
      this.page.total = Math.ceil(this.rows / this.perPage)
    },
  },

  watch: {
    perPage() {
      this.configPagination()
    },

    rows() {
      this.configPagination()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Pagination {
  display: flex;
  align-items: center;
  color: $darker;
  font-size: 12px;

  .controls {
    > * {
      margin-left: 3px;

      &:first-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
