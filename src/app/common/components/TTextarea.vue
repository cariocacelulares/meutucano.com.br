<template>
  <label :for="`textarea-${_uid}`" :class="wrapperClasses">
    <span v-if="label" class="label">{{ label }}</span>
    <Icon v-if="leftIcon" :name="leftIcon" classes="leftIcon" :size="size" color="dark" />
    <textarea :id="`textarea-${_uid}`" :class="classList" :required="required"
      :disabled="disabled" :placeholder="placeholder" @input="updateValue($event.target.value)"
      :rows="rows">{{ value }}</textarea>
    <Icon v-if="rightIcon" :name="rightIcon" classes="rightIcon" :size="size" color="dark" />
  </label>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light'
    },
    rows: {
      type: String | Number,
      default: 3
    },
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
  },

  data() {
    return {
      oldValue: null
    }
  },

  computed: {
    wrapperClasses() {
      let classList = []

      classList.push('textareaWrapper')
      classList.push(this.size)

      if (this.block) {
        classList.push('block')
      }

      return notEmpty(classList).join(' ')
    },

    classList() {
      let classList = []

      classList.push('TTextarea')
      classList.push(this.classes)
      classList.push(this.color)
      classList.push(this.theme)

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
    updateValue(value) {
      if (!isEmpty(value) || this.oldValue != value) {
        this.$emit('input', value);
        this.oldValue = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

$big: 20px;
$normal: 20px;
$small: 12px;

.textareaWrapper {
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
.big textarea {
  padding: 20px $big;

  &.space-left {
    padding-left: ($big * 2) + 9px;
  }

  &.space-right {
    padding-right: ($big * 2) + 9px;
  }
}

.normal textarea {
  padding: 20px $normal;

  &.space-left {
    padding-left: ($normal * 2) + 9px;
  }

  &.space-right {
    padding-right: ($normal * 2) + 9px;
  }
}

.small textarea {
  padding: 20px $small;

  &.space-left {
    padding-left: ($small * 2) + 9px;
  }

  &.space-right {
    padding-right: ($small * 2) + 9px;
  }
}

textarea {
  display: inline-block;
  width: 100%;
  color: $darker;

  &.light {
    border-radius: $borderRadius;
    border: 1px solid $default;
    background-color: $white;
  }

  &.dark {
    border-radius: $borderRadius;
    background-color: $lighter;
  }

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

  &.light {
    &:hover {
      background-color: darken($white, 1);
      border-color: darken($default, 1);
    }

    &:focus {
      background-color: darken($white, 3);
      border-color: darken($default, 3);
    }
  }

  &.dark {
    &:hover {
      background-color: darken($lighter, 1);
    }

    &:focus {
      background-color: darken($lighter, 3);
    }
  }
}
</style>
