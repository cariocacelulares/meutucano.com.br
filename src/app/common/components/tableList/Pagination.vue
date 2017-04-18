<template>
  <div class="Pagination">
    <span>Página {{ page.current }} de {{ page.total }}</span>
    <div class="controls">
      <TButton @click="firstPage" :disabled="page.current == 1 || page.current == 2"
        size="small" color="light" text="darker">
        <Icon name="angle-double-left" />
      </TButton>
      <TButton @click="prevPage" :disabled="page.current == 1"
        size="small" color="light" text="darker">
        <Icon name="angle-left" />
      </TButton>
      <TButton @click="nextPage" :disabled="page.current == page.total"
        size="small" color="light" text="darker">
        <Icon name="angle-right" />
      </TButton>
      <TButton @click="lastPage" :disabled="page.current == page.total || page.current == (page.total - 1)"
        size="small" color="light" text="darker">
        <Icon name="angle-double-right" />
      </TButton>
    </div>
    <VSeparator :height="30" />
    Mostrar
    <TSelect v-model="perPage" :options="options"
      size="small" class="m-h-10" @input="perPageChanged" />
    por página
    <VSeparator :height="30" />
    Total de {{ rows }} registros
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
    rows: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      page: {
        current: 1,
        total: 1,
      },
      perPage: 10
    }
  },

  computed: {
    options() {
      return [
        { text: '10', value: 10 },
        { text: '30', value: 30 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
      ]
    },
  },

  watch: {
    rows() {
      this.configPagination()
    }
  },

  methods: {
    configPagination() {
      this.page.total = Math.ceil(this.rows / this.perPage)
    },

    firstPage() {
      this.page.current = 1
    },

    prevPage() {
      this.page.current = (this.page.current - 1)
    },

    nextPage() {
      this.page.current = (this.page.current + 1)
    },

    lastPage() {
      this.page.current = this.page.total
    },

    perPageChanged(value) {
      this.perPage = value
      this.configPagination()
    }
  }
}
</script>

<style lang="scss">
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
