<template>
  <ContentBox :discret="true" :boxed="true" :class="{ grid: true, loading: loading }">
    <CommentsBox/>
  </ContentBox>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
