<template>
  <ContentBox :discret="true">
    <aside class="sidebar">
      <ul>
        <li>
          <a href="#" class="active">
            <strong>Estoque físico</strong>
            <span>Quantidade em estoque: 233</span>
          </a>
        </li>
        <li>
          <a href="#">
            <strong>A revisar</strong>
            <span>Quantidade em estoque: 13</span>
          </a>
        </li>
        <li>
          <a href="#">
            <strong>Loja física</strong>
            <span>Quantidade em estoque: 42</span>
          </a>
        </li>
        <li>
          <a href="#">
            <strong>Estoque antigo</strong>
            <span>Quantidade em estoque: 0</span>
          </a>
        </li>
      </ul>
      <TButton color="light" text="darker" leftIcon="plus" @click="showAddDepot = true">Adicionar depósito</TButton>
      <TButton color="light" text="darker" leftIcon="plus" @click="showFodase = true">faodase</TButton>
    </aside>

    <div :class="'content-wrapper depot-' + depotIndex">
      <article class="inner-content">
        <header>
          <FeaturedValue label="Depósito" value="Estoque físico" color="darker" />
          <FeaturedValue label="Incluir para venda" value="Sim" color="darker" />
          <FeaturedValue label="Ordem de saída" value="0" color="darker" />
          <FeaturedValue label="Controle de serial" value="Sim" color="darker" />
          <FeaturedValue label="Quantidade" value="223" color="darker" />

          <div class="buttons">
            <TButton color="info" text="white" leftIcon="exchange" class="m-r-10">Transferir</TButton>
            <TButton color="danger" text="white" leftIcon="close">Excluir</TButton>
          </div>
        </header>

        <HSeparator :spacing="20" />

        <TableList :namespace="namespace" searchText="Pesquisar seriais">
          <thead slot="head">
            <tr>
              <th>Serial</th>
              <th>Entrada</th>
              <th></th>
            </tr>
          </thead>
          <tbody slot="body">
            <tr v-for="serial in serials">
              <td>{{ serial.serial }}</td>
              <td>{{ `${serial.entry.date} por ${serial.entry.user.name}` }}</td>
              <td>
                <router-link :to="{ name: 'products.list' }">
                  <Icon name="eye" size="big" text="Ver histórico" color="link" />
                  <VSeparator :spacing="10"/>
                  <Icon name="angle-double-down" size="big" text="Baixa manual" color="danger" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </TableList>
      </article>
    </div>

    <AddDepot :show.sync="showAddDepot" @closed="showAddDepot = false"/>
    <Fodase :show.sync="showFodase" @closed="showFodase = false"/>
  </ContentBox>
</template>

<script>
import AddDepot from './AddDepot'
import Fodase from './Fodase'

export default {
  components: {
    AddDepot,
    Fodase,
  },

  data() {
    return {
      depotIndex: 0,
      namespace: 'products/detail/depots/serials',
      showAddDepot: false,
      showFodase: false,
    }
  },

  computed: {
    serials() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.ContentBox {
  display: flex;
  justify-content: space-between;
}

.sidebar,
.inner-content {
  padding: 20px;
  border-radius: 3px;
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
