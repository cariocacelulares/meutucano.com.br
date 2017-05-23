<template>
  <div :class="'content-wrapper depot-' + (depotProduct.index || 0)">
    <article class="inner-content">
      <header>
        <FeaturedValue label="Depósito" :value="depotProduct.depot.title" color="darker" />
        <FeaturedValue label="Incluir para venda" :value="depotProduct.depot.include ? 'Sim' : 'Não'" color="darker" />
        <FeaturedValue label="Ordem de saída" :value="depotProduct.depot.priority" color="darker" />
        <FeaturedValue label="Quantidade" :value="depotProduct.quantity" color="darker" />

        <div class="buttons">
          <TButton @click="openTransferStock" color="info" text="white" leftIcon="exchange" class="m-r-10">Transferir</TButton>
          <TButton @click="$confirm(destroy, depotProduct.id)" color="danger" text="white" leftIcon="close">Excluir</TButton>
        </div>
      </header>

      <HSeparator :spacing="20" />

      <TableList :namespace="namespace" :wait="wait">
        <thead slot="head">
          <tr>
            <th>Serial</th>
            <th>Custo</th>
            <th></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="serial in serials">
            <td>{{ serial.serial }}</td>
            <td>{{ serial.cost | money }}</td>
            <td>
              <router-link :to="{ name: 'products.list' }">
                <Icon name="eye" text="Ver histórico" color="link" />
              </router-link>
              <VSeparator :spacing="10" :height="10" />
              <router-link :to="{ name: 'products.list' }">
                <Icon name="angle-double-down" text="Baixa manual" color="danger" />
              </router-link>
            </td>
          </tr>
        </tbody>
      </TableList>
    </article>

    <TransferStock :from="depotProduct.depot_slug || null" @close="load" />
  </div>
</template>

<script>
import TransferStock from './TransferStock'

export default {
  components: {
    TransferStock,
  },

  data() {
    return {
      depotsProduct: [],
      namespace: 'products/detail/depots/serials',
      wait: true,
    }
  },

  computed: {
    sku() {
      return this.$route.params.sku
    },

    depotId() {
      return this.$route.params.id
    },

    depotIndex() {
      return this.$route.params.depotIndex || 0
    },

    serials() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    depotProduct() {
      return this.$store.getters['products/detail/depots/GET'] || {
        id: null,
        index: 0,
        quantity: null,
        depot: {
          title: null,
          include: null,
          priority: null,
        },
      }
    }
  },

  watch: {
    depotProduct() {
      if (this.depotProduct.id) {
        if (this.wait) {
          this.wait = false
        } else {
          this.load()
        }
      }
    },
  },

  methods: {
    destroy(id) {
      axios.delete(`depots/products/${id}`).then((response) => {
        this.$parent.$forceUpdate()
        this.$router.push({ name: 'products.detail.depots', params: { sku: this.sku } })
      })
    },

    load() {
      axios.get(`depots/products/${this.depotProduct.id}`).then((response) => {
        this.depotProduct = response.data
      })

      this.$store.dispatch('global/tableList/FETCH')
    },

    openTransferStock() {
      this.$root.$emit('show::modal-TransferStock')
    },
  }
}
</script>

<style lang="scss">
@import '~style/vars';

.content-wrapper {
  position: relative;
  flex-basis: calc(100% - 295px);
  min-height: calc(100vh - 275px);

  $diff: 5px;
  $initial: 24px;
  @for $i from 0 through 11 {
    $before: 0;
    @if ($i == 0) {
      $before: $initial;
    } @else {
      $before: $initial + (56px * $i);
    }

    &.depot-#{$i} {
      &:before {
        top: $before;
      }

      &:after {
        top: $before - $diff;
      }
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 6px;
    left: -13.5px;
    box-shadow: $defaultShadow;
    width: 27px;
    height: 27px;
    transform: rotate(45deg);
    background-color: $white;
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 1px;
    left: -18px;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-right: 18px solid $white;
    z-index: 3;
  }
}

.inner-content {
  position: relative;
  height: 100%;
  z-index: 2;
  padding: 20px;
  border-radius: $borderRadius;
  box-shadow: $defaultShadow;
  background-color: $white;

  header {
    display: flex;
    justify-content: space-between;
    height: 40px;

    * {
      max-height: 100%;
    }
  }

  .buttons {
    margin-left: 50px;
  }
}
</style>
