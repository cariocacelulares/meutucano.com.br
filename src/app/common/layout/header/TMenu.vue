<template>
  <ul>
    <li>
      <router-link :to="{ path: 'dashboard' }">
        <Icon name="home" />
        Início
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'orders.list' }">
        <Icon name="list" />
        Pedidos
      </router-link>
    </li>
    <li>
      <a href="#">
        <Icon name="group" />
        Clientes
      </a>
    </li>
    <li>
      <router-link :to="{ name: 'products.list' }">
        <Icon name="futbol-o" />
        Produtos
      </router-link>
    </li>
  </ul>
</template>

<script>
import Icon from 'common/components/Icon'

export default {
  components: {
    Icon,
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

ul {
  font-size: 13px;
  color: $darker;

  li {
    display: inline-block;
    list-style: none;
    padding: 0 12px;
  }

  .Icon {
    margin-right: 5px;
  }

  a {
    transition: color linear 100ms;
  }

  li:hover,
  li:focus {
    color: $primary;

    a {
      text-decoration: none;
    }
  }

  a.active,
  a:hover,
  a:focus {
    color: $primary;
    text-decoration: none;
  }
}
</style>
