<template>
  <ul class="TMenu">
    <li>
      <router-link :to="{ path: 'dashboard' }">
        <Icon name="home" text="Início" />
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'orders.list' }">
        <Icon name="list" text="Pedidos" />
      </router-link>
    </li>
    <li>
      <a href="#">
        <Icon name="group" text="Clientes" />
      </a>
    </li>
    <li>
      <router-link :to="{ name: 'products.list' }">
        <Icon name="futbol-o" text="Produtos" />
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.TMenu {
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
    color: inherit;
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
