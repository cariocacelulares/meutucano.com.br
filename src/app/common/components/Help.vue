<template>
  <div :class="classList">
    <Icon name="question-circle" size="big" :class="iconClass" />

    <div class="help-box">
      <Icon name="info" />
      <div>
        <span>{{ title }}</span>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: null
    },
    color: {
      type: String
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('Help')

      if (!this.message) {
        classList.push('no-message')
      }

      return notEmpty(classList).join(' ')
    },

    iconClass() {
      let classList = []

      classList.push(`text-${this.color}`)

      return notEmpty(classList).join(' ')
    },
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

  &:not(.no-message) {
    .help-box {
      top: -12px;
      left: 45px;
      height: 58px;

      &:before {
        top: 6px;
        left: -15px;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-right: 15px solid #DAEFFD;
      }

      .Icon {
        padding-top: 4px;
      }
    }
  }

  &.no-message {
    .help-box {
      top: -10px;
      left: 40px;

      &:before {
        top: 8px;
        left: -10px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid $lightPrimary;
      }
    }
  }

  .help-box {
    position: absolute;
    padding: 10px 15px;
    border-radius: 4px;
    color: $darkPrimary;
    background-color: $lightPrimary;
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
    }

    .Icon {
      margin-right: 10px;
      font-size: 14px;
      align-self: flex-start;
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
