<template>
  <input v-bind:type="type" v-bind:class="classes" v-bind:required="required"
    v-bind:placeholder="placeholder" :value="value"
    @input="updateValue($event.target.value)"/>
</template>

<script>
export default {
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
      default: ''
    }
  },
  computed: {
    classes() {
      let classes = [];

      classes.push(this.class);
      classes.push(this.color);
      classes.push(this.size);

      if (this.block) {
        classes.push('block');
      }

      return classes.join(' ');
    }
  },
  methods: {
    updateValue(value) {
      // validação aqui?
      this.$emit('input', value);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars.scss';

input {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid $default;
  background-color: $white;

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
    line-height: 50px;
    padding: 0 20px;
  }
}
</style>
