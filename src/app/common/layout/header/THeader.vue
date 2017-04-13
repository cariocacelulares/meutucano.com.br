<template>
  <header>
    <img class="logo" src="/static/images/logo.png" alt="Meu Tucano">

    <GlobalSearch />

    <div class="menu-containter">
      <TMenu />
      <UserProfile />
    </div>
  </header>
</template>

<script>
import GlobalSearch from './GlobalSearch'
import TMenu from './TMenu'
import UserProfile from './UserProfile'

export default {
  components: {
    GlobalSearch,
    TMenu,
    UserProfile,
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: $white;

  .logo {
    height: 26px;
  }

  .menu-containter {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
