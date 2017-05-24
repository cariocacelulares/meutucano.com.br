<template>
  <label :for="`checkbox-${_uid}`" :class="wrapperClasses" @click="toggle">
    <button type="button" :name="`checkbox-${_uid}`" class="checkbox">
      <Icon v-if="currentValue" name="check" />
    </button>
    <span v-if="label" :class="['label', `text-${color}`, { bold }]">{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: String | Number
    },
    label: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'dark'
    },
    bold: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },

  watch: {
    value() {
      this.currentValue = this.value
    }
  },

  computed: {
    wrapperClasses() {
      let classList = []

      classList.push('checkboxWrapper')
      classList.push(this.size)

      return notEmpty(classList).join(' ')
    },
  },

  data() {
    return {
      currentValue: false
    }
  },

  mounted() {
    this.currentValue = this.value
  },

  methods: {
    toggle() {
      this.currentValue = !this.currentValue
      this.$emit('input', this.currentValue)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.checkboxWrapper {
  position: relative;
  display: flex;
  align-items: center;

  &.disabled,
  &[disabled],
  .disabled,
  [disabled] {
    opacity: .3;

    &, > * {
      cursor: not-allowed;
    }
  }

  .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: $white;
    border: 1px solid $default;
    border-radius: $borderRadius;

    &:hover {
      background-color: darken($white, 1);
      border-color: darken($default, 1);
    }

    &:focus {
      background-color: darken($white, 3);
      border-color: darken($default, 3);
    }

    .Icon {
      color: $darker;
      font-size: 10px;
    }
  }

  .label {
    display: block;
    line-height: 1;
    font-size: 12px;
    margin-left: 10px;
    color: $dark;
    cursor: pointer;

    &.bold {
      font-weight: bold;
    }
  }
}
</style>
