<template>
  <button v-bind:type="type" v-bind:class="classes"
    >{{ text }}</button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    text: {
      type: String,
      required: true
    },
    block: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'default'
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

  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars.scss';

button {
  display: inline-block;
  border-radius: 3px;
  color: #FFF;
  cursor: pointer;

  &.block {
    display: block;
    width: 100%;
  }

  // colors
  @each $name, $color in $colors {
    &.#{$name} {
      background-color: $color;
      transition: background-color linear 150ms;
    }

    &.#{$name}:focus,
    &.#{$name}:hover {
      background-color: darken($color, 5);
    }
  }

  // sizes
  &.big {
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
  }
}
</style>
