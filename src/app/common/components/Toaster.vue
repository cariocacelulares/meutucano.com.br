<template>
  <div id="toaster-container">
    <div v-for="(toast, index) in toasts" :class="toast.type + ' toaster'">
      <Icon :name="getIcon(toast.type)" classes="toastIcon" />
      <div class="text">
        <span>{{ toast.title }}</span>
        <p>{{ toast.message }}</p>
      </div>
      <button @click="closeToast(toast, index)" type="button" class="close">
        <Icon name="close" color="white" />
      </button>
    </div>
  </div>
</template>

<script>
import {
  Icon,
} from './'

export default {
  components: {
    Icon,
  },

  computed: {
    toasts() {
      return this.$store.getters['global/GET_TOASTS']
    },
  },

  methods: {
    getIcon(type) {
      if (type == 'success') {
        return 'check'
      } else if (type == 'error') {
        return 'exclamation-circle'
      } else if (type == 'info') {
        return 'info'
      } else if (type == 'warning') {
        return 'exclamation-triangle'
      }

      return 'info'
    },

    closeToast(toast, index) {
      if (this.toasts[index] == toast) {
        this.toasts.splice(index, 1)
      }
    },
  },

  watch: {
    toasts() {
      if (this.toasts.length) {
        setTimeout(() => {
          this.closeToast(this.toasts[0], 0)
        }, 5000)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

#toaster-container {
  position: absolute;
  top: 20px;
  right: 20px;
  color: $white;
  display: flex;
  flex-direction: column-reverse;
  opacity: .9;
}

.toaster {
  position: relative;
  width: 280px;
  min-height: 65px;
  padding: 15px 20px;
  border-radius: 3px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &:first-child {
    margin-bottom: 0;
  }

  &.warning {
    background-color: $warning;
    border: 1px solid darken($warning, 8);
  }

  &.success {
    background-color: $success;
    border: 1px solid darken($success, 8);
  }

  &.error {
    background-color: $danger;
    border: 1px solid darken($danger, 8);
  }

  &.info {
    background-color: $info;
    border: 1px solid darken($info, 8);
  }

  .toastIcon {
    font-size: 25px;
    width: 25px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 15px;
  }

  .text {
    padding-left: 15px;

    span {
      font-size: 14px;
      font-weight: bold;
    }

    p {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
