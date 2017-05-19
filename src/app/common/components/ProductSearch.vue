<template>
  <div :class="['ProductSearch', { open: open }]">
    <div class="input-wrapper">
      <Icon name="search" />
      <input v-model="sku" placeholder="SKU..."
        @keyup.esc="onEscape"
        @keydown.up.prevent="typeAheadUp"
        @keydown.down.prevent="typeAheadDown"
        @keydown.enter.prevent
        @keyup.enter.prevent="typeAheadSelect"
        @blur="onSearchBlur"
        @focus="onSearchFocus"
        @input="onSearch($event.target.value)"
        ref="input"
        />
    </div>
    <transition name="fade">
      <ul v-if="open" class="dropdown" ref="dropdown">
        <li v-for="(item, index) in options" :ref="`item-${index}`"
          :class="{ active: (active == index), highlight: (highlight == index) }"
          @mouseover="highlight = index"
          @click="typeAheadSelect"
          >
          <strong>SKU: {{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </li>
        <li v-if="!options.length" class="no-results">Nenhum resultado</li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sku: null,
      open: false,
      active: null,
      highlight: null,
      options: [],
    }
  },

  methods: {
    adjustScroll() {
      const item = this.$refs[`item-${this.highlight}`][0]
      const height = item.offsetHeight

      this.$refs.dropdown.scrollTop = height * this.highlight
    },

    closeDropdown() {
      this.open = false
      this.$refs.input.blur()
    },

    onEscape() {
      this.closeDropdown()
    },

    typeAheadUp() {
      if (!this.highlight && this.options.length) {
        this.highlight = this.options.length -1
      } else {
        this.highlight = this.highlight - 1
      }

      this.adjustScroll()
    },

    typeAheadDown() {
      if (!this.highlight && this.highlight !== 0 && this.options.length) {
        this.highlight = 0
      } else {
        if (this.highlight == (this.options.length - 1)) {
          this.highlight = 0
        } else {
          this.highlight = this.highlight + 1
        }
      }

      this.adjustScroll()
    },

    typeAheadSelect() {
      this.active = this.highlight
      this.sku = this.options[this.highlight].object.sku

      this.$emit('input', this.options[this.highlight].object)
      this.closeDropdown()
    },

    onSearchBlur() {
      this.closeDropdown()
    },

    onSearchFocus() {
      this.open = true
    },

    onSearch(search) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        axios.get(`products/find/${search}`).then(
          (response) => {
            this.options = response.data.map((item) => {
              return {
                value: item.sku,
                label: item.title,
                object: item,
              }
            })
          }
        )
      }.bind(this), 500)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.ProductSearch {
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 5px;
    opacity: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    transition: all 250ms;
    border-bottom: 10px solid $white;
  }

  &:before {
    bottom: -15px;
  }

  &:after {
    bottom: -16px;
  }

  &.open {
    &:before,
    &:after {
      opacity: 1;
    }

    &:before {
      border-bottom: 10px solid $default;
    }
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;

    .Icon {
      width: 30px;
      height: 100%;
      color: $dark;
      border: 1px solid $default;
      background-color: $light;
      border-radius: $borderRadius 0 0 $borderRadius;
    }

    input {
      height: 100%;
      padding: 0 10px;
      color: $darker;
      border: 1px solid $default;
      border-left: none;
      border-radius: 0 $borderRadius $borderRadius 0;
      background-color: $white;
    }
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 15px);
    left: 0;
    min-width: 100%;
    max-height: 104px;
    list-style: none;
    text-align: left;
    border: 1px solid $default;
    border-radius: 0 $borderRadius $borderRadius $borderRadius;
    background-color: $white;
    overflow-y: auto;

    li {
      padding: 10px;
      white-space: nowrap;
      cursor: pointer;

      &.highlight,
      &:hover,
      &:focus {
        text-decoration: underline;
        background-color: $light;
      }

      &.active {
        text-decoration: underline;
      }

      &.no-results {
        text-align: center;
      }

      span {
        display: block;
        margin-top: 5px;
      }
    }
  }
}
</style>
