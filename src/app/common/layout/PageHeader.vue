<template>
  <div class="PageHeader">
    <slot name="left"></slot>
    <slot></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scope>
@import '~style/vars';

$height: 80px;
$padding: 20px;

.PageHeader {
  height: $height;
  padding: $padding;
  margin-bottom: 20px;
  background-color: $white;
  box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);
  justify-content: space-between;

  * {
    max-height: $height - ($padding * 2);
  }

  &,
  .left,
  .right {
    display: flex;
    align-items: center;
  }

  .left,
  .right {
    align-self: stretch;
  }
}
</style>
