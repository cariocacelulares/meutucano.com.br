<template>
  <div class="page-header">
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scope>
@import '~style/vars';

.page-header {
  height: 80px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: $white;
  box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);
}
</style>
