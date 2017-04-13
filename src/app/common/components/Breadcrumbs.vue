<template>
  <ul>
    <li><a href="#"><Icon /></a></li>
    <li><a href="#">Vendas</a></li>
    <li><a href="#" class="active">Pedidos</a></li>
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
  li {
    list-style: none;
    display: inline-block;

    &:after {
      content: '>';
      padding: 0 10px 0 5px;
    }

    &:last-child:after {
      content: '';
    }

    .active {
      color: $darker;
    }

    a:hover,
    a:focus {
      color: $darker;
    }
  }
}
</style>
