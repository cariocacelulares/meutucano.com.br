<template>
  <!-- <ul>
    <li><a href="#"><Icon name="home" /></a></li>
    <li><a href="#">Vendas</a></li>
    <li><a href="#" class="active">Pedidos</a></li>
  </ul> -->
  <nav class="breadcrumbs">
    <ul>
      <li>
        <router-link :to="{ path: 'dashboard' }" class="home">
          <Icon name="home" />
        </router-link>
        <Icon name="angle-right" class="right-icon" />
      </li>
      <li v-for="(crumb, i) in $breadcrumbs">
        <router-link :to="{ path: crumb.path }">
          {{ crumb.meta.breadcrumb }}
        </router-link>
        <Icon v-if="crumb.path != $route.path" name="angle-right" class="right-icon" />
      </li>
    </ul>
  </nav>
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

    .active:not(.home) {
      color: $darker;
    }

    a:hover,
    a:focus {
      color: $darker;
    }

    .right-icon {
      padding: 0 10px;
    }
  }
}
</style>
