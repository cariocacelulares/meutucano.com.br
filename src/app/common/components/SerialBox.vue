<template>
  <div class="SerialBox">
    <span v-if="label" class="label">{{ label }}</span>
    <form class="serial-wrapper">
      <ul>
        <li v-for="(serial, index) in serials">
          <span>
            <Icon v-if="serial.valid" name="check" color="success" />
            <Icon v-if="!serial.valid" name="ban" color="danger" />
            {{ serial.serial }}
          </span>
          <TButton @click="removeSerial(index)" :discrete="true">
            <Icon name="close" color="danger" text="Remover" />
          </TButton>
        </li>
        <li class="input">
          <Icon name="ellipsis-h" color="dark" />
          <TInput placeholder="Digite o serial ou utilize um leitor" :block="true" :discrete="true" />
        </li>
      </ul>
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
    }
  },

  watch: {
    serials() {
      this.valid = 0

      this.serials.forEach((item) => {
        if (item.valid) {
          this.valid++
        }
      })
    }
  },

  methods: {
    removeSerial(index) {
      this.$emit('remove', index)
    },
  },

  computed: {
    /*classList() {
      let classList = []

      classList.push('VSeparator')
      classList.push(this.classes)
      classList.push(`bg-${this.color}`)

      classList = classList.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classList.join(' ')
    }*/
  }
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
      display: flex;
      flex-direction: column;
    }

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
