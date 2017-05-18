<template>
  <div class="MonthPicker">
    <a href="#" @click.prevent="prev">
      <Icon name="angle-left" />
    </a>
    <span>{{ date.label }}</span>
    <a href="#" @click.prevent="next">
      <Icon name="angle-right" />
    </a>
  </div>
</template>

<script>
export default {
  // props: {
  //   value: {
  //     type: Date,
  //     required: true
  //   }
  // },

  data() {
    return {
      dateObject: null,
      date: {
        label: null,
        month: null,
        year: null,
      },
    }
  },

  watch: {
    date() {
      this.$emit('input', this.date)
    }
  },

  beforeMount() {
    this.dateObject = moment()
    this.prepare()
  },

  methods: {
    prepare() {
      this.date = {
        label: this.dateObject.format('MMMM\/YYYY'),
        month: this.dateObject.format('MM'),
        year: this.dateObject.format('YYYY'),
        date: this.dateObject.format('MM\/YYYY'),
      }
    },

    prev() {
      this.dateObject.subtract(1, 'M')
      this.prepare()
    },

    next() {
      this.dateObject.add(1, 'M')
      this.prepare()
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.MonthPicker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  color: $darker;
  background-color: $lighter;
  border-radius: $borderRadius;
  font-weight: bold;

  span {
    padding: 0 20px;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    color: $dark;
    transition: all linear 150ms;

    &:hover,
    &:focus {
      text-decoration: none;
      background-color: $light;
    }
  }
}
</style>
