<template>
  <div class="Help">
    <Icon name="question-circle" size="big" :class="classList" />

    <div class="help-box">
      <Icon name="info" />
      <div>
        <span>{{ title }}</span>
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push(`text-${this.color}`)

      return notEmpty(classList).join(' ')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Help {
  position: relative;
  display: inline-block;

  > .Icon {
    padding: 0 10px;
  }

  &, * {
    cursor: default;
  }

  &:hover .help-box {
    opacity: 1;
    visibility: visible;
    z-index: 999;
  }

  .help-box {
    position: absolute;
    top: -11px;
    left: 45px;
    height: 58px;
    padding: 10px 15px;
    border-radius: 4px;
    color: #2B6A94;
    background-color: #DAEFFD;
    transition: all linear 200ms;
    display: flex;
    align-items: center;
    white-space: nowrap;

    opacity: 0;
    visibility: hidden;
    z-index: -1;

    &:before {
      content: '';
      position: absolute;
      top: 6px;
      left: -15px;
      border-top: 15px solid transparent;
      border-bottom: 15px solid transparent;
      border-right: 15px solid #DAEFFD;
    }

    .Icon {
      margin-right: 10px;
      font-size: 14px;
      align-self: flex-start;
      padding-top: 4px;
    }

    span {
      font-weight: bold;
      font-size: 12px;
    }

    p {
      margin-top: 5px;
      font-size: 11px;
    }
  }
}
</style>
