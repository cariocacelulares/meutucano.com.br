<template>
  <select :class="classes" :required="required"
    :placeholder="placeholder" :value="value"
    @input="updateValue($event.target.value)">
    <option v-if="!value && placeholder" selected disabled value="">{{ placeholder }}</option>
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    value: {
      type: String | Number
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
    class: {
      type: String,
      default: null
    }
  },
  computed: {
    classes() {
      let classes = []

      classes.push('TSelect')
      classes.push(this.class)
      classes.push(this.color)
      classes.push(this.size)

      if (this.block) {
        classes.push('block')
      }

      classes = classes.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classes.join(' ')
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

.TSelect {
  display: inline-block;
  border-radius: 3px;
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
    padding: 0 20px;
  }

  &.small {
    height: 30px;
    padding: 0 12px;
  }
}
</style>
