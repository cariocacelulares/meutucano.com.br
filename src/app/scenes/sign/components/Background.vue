<template>
    <div class="sign-wrapper">
      <slot></slot>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.sign-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;

  $formWidth: 350px;

  > form {
    align-self: center;
    width: $formWidth;
    padding: 40px 20px;
    background-color: #FFF;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);

    @media all and (max-width: $formWidth) {
      width: 100%;
    }
  }
}
</style>
