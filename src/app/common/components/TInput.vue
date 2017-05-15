<template>
  <label :for="`input-${_uid}`" :class="wrapperClasses">
    <span v-if="label" class="label">{{ label }}</span>
    <Icon v-if="leftIcon" :name="leftIcon" classes="leftIcon" :size="size" color="dark" />
    <input :id="`input-${_uid}`" :type="type" :class="classList" :required="required"
      :placeholder="placeholder" :value="value" :min="min" :max="max" :step="step"
      :disabled="disabled" @input="updateValue($event.target.value)" />
      <!-- @input="updateValue($event.target.value)" @blur="formatValue" ref="input" :disabled="disabled" /> -->
    <Icon v-if="rightIcon" :name="rightIcon" classes="rightIcon" :size="size" color="dark" />
  </label>
</template>

<script>
// import { default as CommonTransformer } from 'common/transformer'

export default {
  props: {
    value: {
      type: String | Number
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    block: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'white'
    },
    size: {
      type: String,
      default: 'normal'
    },
    classes: {
      type: String,
      default: null
    },
    leftIcon: {
      type: String
    },
    rightIcon: {
      type: String
    },
    discrete: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /*filter: {
      type: String,
      default: null
    },*/
  },

  data() {
    return {
      oldValue: null
    }
  },

  computed: {
    wrapperClasses() {
      let classList = []

      classList.push('inputWrapper')
      classList.push(this.size)

      if (this.block) {
        classList.push('block')
      }

      return notEmpty(classList).join(' ')
    },

    classList() {
      let classList = []

      classList.push('TInput')
      classList.push(this.classes)
      classList.push(this.color)

      if (this.leftIcon) {
        classList.push('space-left')
      }

      if (this.rightIcon) {
        classList.push('space-right')
      }

      if (this.discrete) {
        classList.push('discrete')
      }

      return notEmpty(classList).join(' ')
    }
  },

  methods: {
    /*format(data) {
      data = data ? data : ''

      if (this.filter) {
        if (this.filter == 'money') {
          return CommonTransformer.monetary(data)
        } else if (this.filter == 'date') {
          return CommonTransformer.date(data)
        }
      }

      return data
    },*/

    updateValue(value) {
      if (!isEmpty(value) || this.oldValue != value) {
        // this.$emit('input', this.format(value))
        this.$emit('input', value)
        // this.oldValue = this.format(value)
        this.oldValue = value
      }
    },

    /*formatValue() {
      this.$refs.input.value = this.format(this.value)
    },*/
  },

  mounted() {
    // this.formatValue()
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

$big: 20px;
$normal: 20px;
$small: 12px;

.inputWrapper {
  position: relative;
  display: inline-block;

  &.big {
    .leftIcon { left: $big }
    .rightIcon { right: $big }
  }

  &.small {
    .leftIcon { left: $small }
    .rightIcon { right: $small }
  }

  .leftIcon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .rightIcon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}

.label {
  display: block;
  line-height: 1;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 12px;
  color: $inputLabel;
}

// sizes
.big input {
  height: 50px;
  padding: 0 $big;

  &.space-left {
    padding-left: ($big * 2) + 9px;
  }

  &.space-right {
    padding-right: ($big * 2) + 9px;
  }
}

.normal input {
  height: 40px;
  padding: 0 $normal;

  &.space-left {
    padding-left: ($normal * 2) + 9px;
  }

  &.space-right {
    padding-right: ($normal * 2) + 9px;
  }
}

.small input {
  height: 30px;
  padding: 0 $small;

  &.space-left {
    padding-left: ($small * 2) + 9px;
  }

  &.space-right {
    padding-right: ($small * 2) + 9px;
  }
}

input {
  display: inline-block;
  width: 100%;
  border-radius: $borderRadius;
  border: 1px solid $default;
  color: $darker;
  background-color: $white;

  &::placeholder {
    color: $dark;
  }

  &[disabled] {
    opacity: .3;

    &, > * {
      cursor: not-allowed;
    }
  }

  &.discrete {
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    background-color: transparent;

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }

  &:hover {
    background-color: darken($white, 1);
    border-color: darken($default, 1);
  }

  &:focus {
    background-color: darken($white, 3);
    border-color: darken($default, 3);
  }
}
</style>
