<template>
  <div :class="{ dropdown: true, opened: opened }" @click="open">
    <div class="selection">
      <input v-model="term" :placeholder="placeholder" @input="doSearch"/>
         <!-- <input @blur="blurInput"
         @keydown.up="prevItem"
         @keydown.down="nextItem"
         @keyup.enter="enterItem"
         @keyup.escape="enterItem"
         @keydown.delete="deleteTextOrItem"> -->
      <Icon name="angle-down" />
    </div>
    <ul>
      <li v-for="item in options"
        @click="select(item)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'

export default {
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
    search: {
      type: Function,
      default: null
    },
  },

  data() {
    return {
      selected: null,
      opened: false,
      term: null,
      options: [],
      debounce: null
    }
  },

  methods: {
    select(item) {
      this.selected = item
      this.$root.$emit(`dropdownChanged.${this.name}`, this.selected)
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

    doSearch(event) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        axios.get('lines/fetch' + parseParams({
          search: event.target.value
        })).then(
          (response) => {
            this.options = []
            response.data.forEach((item) => {
              this.options.push({
                label: item.title,
                value: item.id
              })
            })

            console.log(this.options)
          },
          (error) => {
            console.log(error)
          },
        )
      }.bind(this), 500)
    }
    // doSearch(event) {
       /*_.debounce((event) => {
        console.log(event.target.value)

      }, 500)*/
    // },
  },

  watch: {
    selected: {
      handler() {
        if (this.selected) {
          this.term = this.selected.label
        }
      },
      deep: true
    },
  },

  mounted() {
    if (this.selected) {
      this.term = this.selected.label
    }

    this.options = this.itens
  },
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
