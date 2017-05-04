<template>
  <article :class="classList">
    <header v-if="headerIcon || headerText" :style="{
        marginBottom: `${headerMarginBottom}px`
      }">
      <Icon v-if="headerIcon" :name="headerIcon" />
      <h1>{{ headerText }}</h1>
    </header>
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
  padding: 20px;
  background-color: $white;
  box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);
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

    h1 {
      font-size: inherit;
      font-weight: bold;
      padding: 0;
      margin: 0 0 0 10px;
    }
  }
}
</style>
