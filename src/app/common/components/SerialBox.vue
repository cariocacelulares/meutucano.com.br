<template>
  <div class="SerialBox">
    <span v-if="label" class="label">{{ label }}</span>
    <form class="serial-wrapper" @submit.prevent="addSerial">
      <ul :class="{ scrollbar: serials.length > 4 }">
        <li v-for="(serial, index) in serials">
          <span>
            <Icon v-if="serial.valid" name="check" color="success" />
            <Icon v-if="serial.valid === false" name="ban" color="danger" />
            <Icon v-if="serial.valid === null" name="refresh" :spin="true" color="darker" />
            {{ serial.serial }}
          </span>
          <TButton @click="removeSerial(index)" :discrete="true">
            <Icon name="close" color="danger" text="Remover" />
          </TButton>
        </li>
      </ul>
      <div class="input">
        <Icon name="ellipsis-h" color="dark" />
        <TInput v-model="serial" :block="true" :discrete="true"
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
      const newLength = this.serials.push({
        serial: this.serial,
        valid: null,
        message: null,
      })

      this.$emit('add', (newLength - 1))

      this.serial = null
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
      max-height: 190px;
      overflow-y: auto;

      &.scrollbar {
        position: relative;
        left: 15px;
        width: calc(100% + 15px);
      }
    }

    .input {
      width: 100%;
    }

    .input,
    li {
      list-style: none;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:first-child) {
        margin-top: 10px;
      }

      padding: 0 25px;
      border-radius: $borderRadius;
      border: 1px solid $default;
      background-color: $white;

      span .Icon,
      &.input .Icon {
        margin-right: 15px;
      }
    }
  }
}
</style>
