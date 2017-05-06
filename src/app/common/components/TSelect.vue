<template>
  <label :for="`select-${_uid}`" :class="wrapperClasses">
    <span v-if="label" class="label">{{ label }}</span>
    <Icon v-if="leftIcon" :name="leftIcon" classes="leftIcon" :size="size" color="dark" />
    <select :id="`select-${_uid}`" :class="classList" :required="required"
      :placeholder="placeholder" :value="value"
      @input="updateValue($event.target.value)">
      <option v-if="!value && placeholder" selected disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <Icon v-if="rightIcon" :name="rightIcon" classes="rightIcon" :size="size" color="dark" />
  </label>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    value: {
      type: String | Number
    },
    label: {
      type: String
    },
    options: {
      type: Array,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
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
  },

  computed: {
    wrapperClasses() {
      let classList = []

      classList.push('selectWrapper')
      classList.push(this.size)

      if (this.block) {
        classList.push('block')
      }

      return notEmpty(classList).join(' ')
    },

    classList() {
      let classList = []

      classList.push('TSelect')
      classList.push(this.classes)
      classList.push(this.color)

      if (this.leftIcon) {
        classList.push('space-left')
      }

      if (this.rightIcon) {
        classList.push('space-right')
      }

      return notEmpty(classList).join(' ')
    }
  },

  methods: {
    updateValue(value) {
      if (!isEmpty(value)) {
        this.$emit('input', value)
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

.selectWrapper {
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
.big select {
  height: 50px;
  padding: 0 $big;

  &.space-left {
    padding-left: ($big * 2) + 9px;
  }

  &.space-right {
    padding-right: ($big * 2) + 9px;
  }
}

.normal select {
  height: 40px;
  padding: 0 $normal;

  &.space-left {
    padding-left: ($normal * 2) + 9px;
  }

  &.space-right {
    padding-right: ($normal * 2) + 9px;
  }
}

.small select {
  height: 30px;
  padding: 0 $small;

  &.space-left {
    padding-left: ($small * 2) + 9px;
  }

  &.space-right {
    padding-right: ($small * 2) + 9px;
  }
}

select {
  display: inline-block;
  width: 100%;
  border-radius: $borderRadius;
  border: 1px solid $default;
  color: $darker;
  background-color: $white;

  &::placeholder {
    color: $dark;
  }

  &:hover {
    background-color: darken($white, 1);
    border-color: darken($default, 1);
  }

  &:focus {
    background-color: darken($white, 3);
    border-color: darken($default, 3);
  }

  &.block {
    display: block;
    width: 100%;
  }

  // sizes
  &.big {
    height: 50px;
    padding: 0 $big;
  }

  &.small {
    height: 30px;
    padding: 0 $small;
  }
}
</style>
