<template>
  <ul>
    <li>
      <Icon />
      <a href="#">Início</a>
    </li>
    <li>
      <Icon />
      <a href="#">Pedidos</a>
    </li>
    <li>
      <Icon />
      <a href="#">Clientes</a>
    </li>
    <li>
      <Icon />
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
    margin-left: 10px;
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
