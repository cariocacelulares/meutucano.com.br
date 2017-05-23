<template>
  <div :class="{ dropdown: true, opened: opened }" @click="open">
    <div class="selection">
      <span v-if="selected.text">{{ selected.text }}</span>
      <span v-if="!selected.text">{{ placeholder }}</span>
      <Icon name="angle-down" />
    </div>
    <ul>
      <li v-for="item in options"
        @click="select(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Selecione'
    },
    options: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      selected: {},
      opened: false,
    }
  },

  methods: {
    select(item) {
      this.selected = item
      this.$emit('input', this.selected)
    },

    close() {
      document.removeEventListener('click', this.close, false);
      this.opened = false
    },

    open(event) {
      event.stopPropagation()

      if (this.opened) {
        this.close()
      } else {
        this.opened = true
        document.addEventListener('click', this.close, false);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';
.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 500;

  &::selection,
  *::selection {
    background: transparent;
    text-shadow: none;
    color: $darker;
  }

  .selection {
    padding: 12px 20px;
    color: $darker;
    background-color: $lighter;
    border-radius: $borderRadius;
    font-weight: bold;

    span {
      margin-right: 20px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  // &:hover {
  &.opened {
    .selection {
      border-radius: 3px 3px 0 0;
    }

    ul {
      max-height: 500px;
      // transition: all 350ms ease-in;
    }
  }

  ul {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    border-radius: 0 0 3px 3px;
    background-color: $lighter;
    box-shadow: 0px 2px 1px 0px $default;
    font-size: .9em;
    // transition effect
    max-height: 0;
    // transition: all 250ms ease-out;
    overflow: hidden;
    transform: translateZ(0);

    li {
      list-style: none;
      cursor: pointer;
      padding: 12px 20px;

      &:hover {
        background-color: $light;
      }
    }
  }
}
</style>
