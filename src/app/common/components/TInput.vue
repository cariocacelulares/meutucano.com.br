<template>
  <label :for="`input-${_uid}`" :class="wrapperClasses">
    <Icon v-if="leftIcon" :name="leftIcon" class="leftIcon" :size="size" color="darker" />
    <input :id="`input-${_uid}`" :type="type" :class="classes" :required="required"
      :placeholder="placeholder" :value="value"
      @input="updateValue($event.target.value)"/>
    <Icon v-if="rightIcon" :name="rightIcon" class="rightIcon" :size="size" color="darker" />
  </label>
</template>

<script>
import { isEmpty } from 'lodash'
import {
  Icon,
} from 'common/components'

export default {
  components: {
    Icon,
  },

  props: {
    value: {
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
    class: {
      type: String
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
  },

  computed: {
    wrapperClasses() {
      let classes = []

      classes.push('inputWrapper')
      classes.push(this.size)

      return this.notEmpty(classes).join(' ')
    },

    classes() {
      let classes = []

      classes.push('TInput')
      classes.push(this.class)
      classes.push(this.color)

      if (this.block) {
        classes.push('block')
      }

      if (this.leftIcon) {
        classes.push('space-left')
      }

      if (this.rightIcon) {
        classes.push('space-right')
      }

      if (this.discrete) {
        classes.push('discrete')
      }

      return this.notEmpty(classes).join(' ')
    }
  },
  methods: {
    notEmpty(array) {
      return array.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });
    },

    updateValue(value) {
      if (!isEmpty(value)) {
        this.$emit('input', value);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

$big: 20px;
$small: 12px;

.inputWrapper {
  position: relative;

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
  border-radius: 3px;
  border: 1px solid $default;
  color: $darker;
  background-color: $white;

  &::placeholder {
    color: $dark;
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

  &.block {
    display: block;
    width: 100%;
  }
}
</style>
