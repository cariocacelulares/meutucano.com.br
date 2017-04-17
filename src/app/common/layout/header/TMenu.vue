<template>
  <ul>
    <li>
      <Icon name="home" />
      <router-link :to="{ path: 'dashboard' }">
        Início
      </router-link>
    </li>
    <li>
      <Icon name="list" />
      <a href="#">Pedidos</a>
    </li>
    <li>
      <Icon name="group" />
      <a href="#">Clientes</a>
    </li>
    <li>
      <Icon name="futbol-o" />
      <a href="#">Produtos</a>
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

  a {
    font-weight: 700;
    margin-left: 5px;
    transition: color linear 100ms;
  }

  li.current,
  li:hover,
  li:focus {
    color: $primary;

    a {
      text-decoration: none;
    }
  }
}
</style>
