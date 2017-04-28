<template>
  <div class="dropdown">
    <div class="selection">
      <span v-if="selected">{{ selected.label }}</span>
      <span v-if="!selected">{{ placeholder }}</span>
      <Icon name="angle-down" />
    </div>
    <ul>
      <li v-for="item in itens"
        @click="select(item)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import { isEmpty } from 'lodash'
import Icon from 'common/components/Icon';

export default {
  components: {
    Icon,
  },

  props: {
    placeholder: {
      type: String,
      default: 'Selecione'
    },
    itens: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      selected: null
    }
  },

  methods: {
    select(item) {
      this.selected = item
      this.$root.$emit(`dropdownChanged.${this.name}`, this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.dropdown {
  float: left;
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
    background-color: $ligther;
    border-radius: 3px;
    font-weight: bold;

    span {
      margin-right: 20px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    .selection {
      border-radius: 3px 3px 0 0;
    }

    ul {
      max-height: 500px;
      transition: all 350ms ease-in;
    }
  }

  ul {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    border-radius: 0 0 3px 3px;
    background-color: $ligther;
    box-shadow: 0px 2px 1px 0px $default;
    font-size: .9em;
    // transition effect
    max-height: 0;
    transition: all 250ms ease-out;
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
