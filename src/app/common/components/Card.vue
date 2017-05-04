<template>
  <article :class="classList">
    <header v-if="headerIcon || headerText" :style="{
        marginBottom: `${headerMarginBottom}px`
      }">
      <div>
        <Icon v-if="headerIcon" :name="headerIcon" />
        <h1>{{ headerText }}</h1>
      </div>

      <div>
        <slot name="header"></slot>
      </div>
    </header>
    <span v-if="loading" class="loading">
      <Icon name="refresh" :spin="true" size="giant" />
    </span>
    <slot></slot>
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
      type: String
    },
    headerText: {
      type: String
    },
    headerMarginBottom: {
      type: Number
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    classList() {
      let classList = []

      classList.push('Card')

      return notEmpty(classList).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Card {
  position: relative;
  padding: 20px;
  background-color: $white;
  box-shadow: $defaultShadow;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  color: $darker;
  overflow: hidden;

  header {
    border-bottom: 1px solid $light;
    margin-bottom: 20px;
    padding-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
