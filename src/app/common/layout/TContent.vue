<template>
  <div class="content">
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scope>
@import '~style/vars';

.content {
  width: calc(100% - 40px);
  margin-left: 20px;
  min-height: 10px;
  padding: 20px;
  background-color: $white;
  box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);
  border-radius: 3px;
}
</style>
