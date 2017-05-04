<template>
  <nav class="breadcrumbs">
    <ul>
      <li>
        <router-link :to="{ path: 'dashboard' }" class="home">
          <Icon name="home" />
        </router-link>
        <Icon name="angle-right" classes="right-icon" />
      </li>
      <li v-for="(crumb, i) in $breadcrumbs">
        <router-link :to="{ path: crumb.path }">{{ crumb.meta.breadcrumb }}</router-link>
        <Icon v-if="crumb.path != $route.path" name="angle-right" classes="right-icon" />
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.breadcrumbs {
  ul {
    li {
      list-style: none;
      display: inline-block;

      .active:not(.home) {
        color: $darker;
      }

      a {
        color: inherit;
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
}
</style>
