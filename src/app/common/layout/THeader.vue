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
import GlobalSearch from './header/GlobalSearch'
import TMenu from './header/TMenu'
import UserProfile from './header/UserProfile'

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
  box-shadow: 0px 0px 10px $default;

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
