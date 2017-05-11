<template>
  <article :class="classList">
    <header v-if="hasHeader">
      <div v-if="headerIcon || headerText">
        <Icon v-if="headerIcon" :name="headerIcon" />
        <h1>{{ headerText }}</h1>
      </div>

      <div :class="{ 'full-width': !(headerIcon && headerText) }">
        <slot name="header"></slot>
      </div>
    </header>
    <span v-if="loading" class="loading">
      <Icon name="refresh" :spin="true" size="giant" />
    </span>
    <div class="card-content">
      <slot></slot>
    </div>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      default: ''
    },
    headerIcon: {
      type: String,
      default: null
    },
    headerText: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    important: {
      type: Boolean,
      default: false
    },
    noFooterSep: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('Card')

      if (this.important) {
        classList.push('important')
      }

      if (this.noFooterSep) {
        classList.push('no-footer-sep')
      }

      return notEmpty(classList).join(' ')
    },

    hasHeader() {
      return (typeof(this.$slots.header) !== 'undefined' || this.headerText || this.headerIcon)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Card {
  position: relative;
  background-color: $white;
  box-shadow: $defaultShadow;
  border-radius: $borderRadius;
  display: flex;
  flex-direction: column;
  color: $darker;
  // overflow: hidden;

  &.important {
    border-top: 5px solid $warning;
  }

  > .card-content {
    padding: 20px;
  }

  > header {
    position: relative;
    padding: 20px 20px 10px 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20px;
      width: calc(100% - 40px);
      height: 1px;
      background-color: $light;
    }

    h1 {
      font-size: inherit;
      font-weight: bold;
      padding: 0;
      margin: 0 0 0 10px;
    }

    > div {
      display: flex;
      align-items: center;

      &:last-child {
        font-size: 12px;
      }
    }
  }

  &:not(.no-footer-sep) > footer:before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    width: calc(100% - 40px);
    height: 1px;
    background-color: $light;
  }

  > footer {
    position: relative;

    > * {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // border-top: 1px solid $light;
      padding: 10px 20px 20px 20px;
    }
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    i {
      margin-top: 25px;
      width: 15px;
      height: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }

  .highcharts {
    position: relative;
    z-index: 1;
  }
}
</style>
