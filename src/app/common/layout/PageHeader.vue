<template>
  <div :class="'PageHeader ' + (tabs ? 'with-tabs' : '')">
    <div>
      <slot name="left"></slot>
      <slot></slot>
      <slot name="right"></slot>
    </div>

    <ul v-if="tabs" class="tabs">
      <li v-for="(tab, index) in tabs">
        <router-link :to="tab.link">
          {{ tab.text }}
          <span v-if="tab.label || tab.label === 0">{{ tab.label }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: null
    }
  },

  methods: {
  },
}
</script>

<style lang="scss" scope>
@import '~style/vars';

$height: 80px;
$tabsHeight: 50px;
$padding: 20px;

.PageHeader {
  padding: $padding;
  margin-bottom: 20px;
  background-color: $white;
  box-shadow: $defaultShadow;

  &:not(.with-tabs) {
    height: $height;

    * {
      max-height: $height - ($padding * 2);
    }
  }

  &.with-tabs {
    height: $height + $tabsHeight;
    padding-bottom: 0;

    & > div * {
      max-height: $height - ($padding * 2);
    }
  }

  & > div,
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left,
  .right {
    align-self: stretch;
  }

  .tabs {
    height: $tabsHeight;
    border-top: 1px solid $light;
    margin-top: $padding;
    display: flex;
    align-items: center;

    li {
      position: relative;
      height: 100%;
      padding: 0 15px 0 16px;
      color: $black;
      list-style: none;
      transition: all linear 200ms;

      &:not(:first-child):before {
        content: '';
        position: absolute;
        top: 16px;
        left: 0;
        width: 1px;
        height: 15px;
        background-color: $default;
      }

      &:first-child {
        padding-left: 0;
      }

      .active,
      a:focus,
      a:hover {
        border-color: $info;
        text-decoration: none;
      }

      a {
        display: inline-block;
        height: 100%;
        padding: 15px 2px;
        border-bottom: 5px solid transparent;
        color: inherit;
        transition: all linear 200ms;
        opacity: .5;

        &.active {
          opacity: 1;
        }

        span {
          display: inline-block;
          height: 18px;
          line-height: 19px;
          margin-left: 8px;
          padding: 0 10px;
          font-size: 10px;
          border-radius: 10px;
          color: $white;
          background-color: $info;
        }
      }
    }
  }
}
</style>
