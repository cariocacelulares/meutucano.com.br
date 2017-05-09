<template>
  <div class="UserInfo">
    <div class="avatar">
      <img :src="avatar" :alt="name">
    </div>
    <div class="personal">
      <span class="name">{{ name }}</span>
      <span class="role">{{ sub }}</span>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'

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

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
