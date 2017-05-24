<template>
  <span :class="[ 'ActiveBadge', { 'bg-success': active } ]" v-tooltip="active ? 'Ativo' : 'Inativo'">
    <Icon :name="active ? 'check' : 'close'" />
  </span>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.ActiveBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  line-height: 1;
  color: $white;
  background-color: $danger;
}
</style>
