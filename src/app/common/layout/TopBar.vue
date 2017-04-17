<template>
  <div class="topbar">
    <Breadcrumbs />

    <a href="#">
      <Icon name="question-circle" size="normal" />
      &nbsp;Ajuda?
    </a>
  </div>
</template>

<script>
import {
  Icon,
  Breadcrumbs
} from 'common/components'

export default {
  components: {
    Icon,
    Breadcrumbs,
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  padding: 0 20px;
  font-size: 12px;
  color: $dark;

  .active {
    color: $darker;
  }

  a:hover,
  a:focus {
    color: $darker;
    text-decoration: none;
  }
}
</style>
