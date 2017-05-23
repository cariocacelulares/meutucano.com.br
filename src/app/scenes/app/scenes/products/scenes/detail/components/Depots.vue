<template>
  <ContentBox :discret="true">
    <aside class="sidebar">
      <ul>
        <li v-for="(depotProduct, index) in depotsProduct">
          <a href="#" @click.prevent="changeDepot(depotProduct, index)"
            :class="{ active: depotProduct.id == depotId }">
            <strong>{{ depotProduct.depot.title }}</strong>
            <span>Quantidade em estoque: {{ depotProduct.quantity }}</span>
          </a>
        </li>
      </ul>
      <TButton color="light" text="darker" leftIcon="plus" @click="openAddDepot">Adicionar depósito</TButton>
    </aside>

    <router-view></router-view>

    <AddDepot @close="load" />
  </ContentBox>
</template>

<script>
import AddDepot from './depots/AddDepot'

export default {
  components: {
    AddDepot,
  },

  data() {
    return {
      depotsProduct: [],
      depotIndex: 0,
    }
  },

  computed: {
    sku() {
      return this.$route.params.sku
    },

    depotId() {
      return this.$route.params.id
    },
  },

  // força o load pra remover os itens quando excluidos
  // (não está passando pelo mount pq já está na tela)
  beforeRouteUpdate(to, from, next) {
    this.load()
    next()
  },

  methods: {
    setDepotProduct(depotProduct) {
      return this.$store.dispatch('products/detail/depots/CURRENT', depotProduct);
    },

    load() {
      axios.get(`depots/products/from/product/${this.sku}`).then((response) => {
        this.depotsProduct = response.data

        if (!this.depotId && this.depotsProduct.length) {
          this.depotsProduct[0].index = 0
          this.setDepotProduct(this.depotsProduct[0])

          this.$router.push({
            name: 'products.detail.depots.detail',
            params: {
              sku: this.sku,
              id: this.depotsProduct[0].id,
              depotIndex: 0,
            }
          })
        } else {
          this.depotsProduct.forEach((item, index) => {
            if (item.id == this.depotId) {
              item.index = index
              this.setDepotProduct(item)

              return;
            }
          })
        }
      })
    },

    changeDepot(depotProduct, index) {
      depotProduct.index = index
      this.setDepotProduct(depotProduct)

      this.$router.push({
        name: 'products.detail.depots.detail',
        params: {
          sku: this.sku,
          id: depotProduct.id,
          depotIndex: index,
        }
      })
    },

    openAddDepot() {
      this.$root.$emit('show::modal-AddDepot')
    },
  },

  beforeMount() {
    this.load()
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.ContentBox {
  display: flex;
  justify-content: space-between;
}

.sidebar {
  padding: 20px;
  border-radius: $borderRadius;
  box-shadow: $defaultShadow;
  background-color: $white;
}

.sidebar {
  width: 250px;
  min-height: calc(100vh - 275px);

  li {
    list-style: none;
    margin-left: -20px;

    a {
      margin-bottom: 20px;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      border-left: 5px solid transparent;
      transition: all linear 200ms;

      &:hover,
      &:focus,
      &.active {
        border-color: $info;
        text-decoration: none;
      }
    }

    strong {
      font-size: 14px;
      color: $darker;
    }

    span {
      margin-top: 5px;
      font-size: 12px;
      color: $dark;
    }
  }

  .TButton {
    width: 100%;
  }
}
</style>
