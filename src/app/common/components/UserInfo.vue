<template>
  <div class="UserInfo">
    <Avatar :src="avatar" :alt="name" />
    <div class="personal">
      <span class="name">{{ name }}</span>
      <span class="role">{{ sub }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.UserInfo {
  display: flex;
  align-items: center;

  .personal {
    margin-left: 10px;

    span {
      display: block;
    }

    .name {
      font-size: 12px;
      color: $darker;
      padding-bottom: 2px;
      font-weight: bold;
    }

    .role {
      font-size: 11px;
      color: $dark;
    }
  }
}
</style>
