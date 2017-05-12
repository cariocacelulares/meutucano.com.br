<template>
  <ContentBox :discret="true" :boxed="true" :class="{ loading: loading }">
    <CommentsBox :order="id" />
  </ContentBox>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    }
  },

  computed: {
    id() {
      return this.$route.params.id
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
