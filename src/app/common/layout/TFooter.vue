<template>
  <footer>
    <span>Desenvolvido por Carioca Celulares &copy; 2017</span>
    <a href="tel:+554735213280">(47) 3521-3280</a>
    <a href="mailto:suporte@meutucano.com.br">suporte@meutucano.com.br</a>
  </footer>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

footer {
  padding: 15px 20px;
  color: $dark;
  font-size: 12px;

  span {
    float: left;
  }

  a {
    float: right;

    &:last-child {
      margin-right: 8px;
      padding-right: 8px;
      border-right: 1px solid $dark;
    }
  }
}
</style>
