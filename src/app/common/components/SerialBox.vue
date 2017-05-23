<template>
  <div class="SerialBox">
    <span v-if="label" class="label">{{ label }}</span>
    <form class="serial-wrapper" @submit.prevent="addSerial">
      <ul :class="{ scrollbar: serials.length > 3 }">
        <li v-for="(serial, index) in serials" v-tooltip="serial.message">
          <span>
            <Icon v-if="serial.valid" name="check" color="success" />
            <Icon v-if="serial.valid === false" name="ban" color="danger" />
            <Icon v-if="serial.valid === null" name="refresh" :spin="true" color="darker" />
          </span>
          <div>
            <strong>{{ serial.serial }}</strong>
            <p v-if="serial.product.title || serial.product.depot.name">
              {{ serial.product.title }}
              <span v-if="serial.product.depot.name"> | {{ serial.product.depot.name }}</span>
            </p>
          </div>
          <TButton @click="removeSerial(index)" :discrete="true">
            <Icon name="close" color="danger" text="Remover" />
          </TButton>
        </li>
      </ul>
      <div class="input">
        <Icon name="ellipsis-h" color="dark" />
        <TInput v-model="serial" :block="true" :discrete="true" :disabled="disabled"
        placeholder="Digite o serial ou utilize um leitor para inserir o serial e pressione enter" />
      </div>
      <span v-if="serials.length && serials.length !== valid">
        <b>{{ valid }}</b> seria{{ (valid === 1) ? 'l' : 'is' }}
        válido{{ (valid !== 1) ? 's' : '' }} de
        <b>{{ serials.length }}</b> informado{{ (serials.length !== 1) ? 's' : '' }}
      </span>
      <span v-if="serials.length && serials.length === valid">
        Todos os seriais informados são válidos!
      </span>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    validate: {
      type: Function,
      default: null,
    },
    serials: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      valid: 0,
      serial: null
    }
  },

  watch: {
    serials: {
      handler() {
        this.valid = 0

        this.serials.forEach((item) => {
          if (item.valid) {
            this.valid++
          }
        })
      },
      deep: true
    }
  },

  methods: {
    removeSerial(index) {
      this.serials.splice(index, 1)
    },

    addSerial() {
      if (!this.serial) {
        return
      }

      const newLength = this.serials.push({
        serial: this.serial,
        valid: null,
        message: null,
        product: {
          title: null,
          depot: {
            name: null
          },
        },
      })

      this.$emit('add', (newLength - 1))

      this.serial = null

      // scroll element to bottom
      setTimeout(() => {
        let scrollbar = document.getElementsByClassName('scrollbar')
        scrollbar = (scrollbar.length) ? scrollbar[0] : null

        if (scrollbar) {
          scrollbar.scrollTop = scrollbar.scrollHeight
        }
      }, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.SerialBox {
  display: block;
  width: 100%;

  .label {
    display: block;
    line-height: 1;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 12px;
    color: $inputLabel;
  }

  .serial-wrapper {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    padding: 20px;
    color: $darker;
    border-radius: $borderRadius;
    background-color: $lighter;
    border: 1px solid $default;

    > span {
      margin-top: 10px;
    }

    ul {
      width: 100%;
      max-height: 210px;
      overflow-y: auto;

      &.scrollbar {
        position: relative;
        left: 15px;
        width: calc(100% + 15px);
      }
    }

    .input,
    li {
      padding: 0 25px;
      border-radius: $borderRadius;
      border: 1px solid $default;
      background-color: $white;
      display: flex;
      align-items: center;
    }

    .input {
      width: 100%;
      height: 40px;
      justify-content: space-between;

      .Icon {
        margin-right: 15px;
      }
    }

    li {
      list-style: none;
      height: 60px;
      margin-bottom: 10px;

      span {
        margin-right: 15px;
      }

      div {
        flex-grow: 1;

        p {
          margin-top: 5px;
          color: $dark;
        }
      }
    }
  }
}
</style>
