<template>
  <div v-if="value || value === 0" class="FeaturedValue">
    <span class="label">{{ label }}</span>
    <span :class="classes">{{ value }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String | Number,
      required: true
    },
    color: {
      type: String,
      dafault: 'primary'
    },
  },

  computed: {
    classes() {
      return `value text-${this.color}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.FeaturedValue {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .label {
    font-size: 12px;
    color: $dark;
    padding-bottom: 3px;
  }

  .value {
    font-size: 18px;
    font-weight: 900;
  }
}
</style>
