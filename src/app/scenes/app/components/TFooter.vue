<template>
  <footer class="TFooter">
    <span>Feito com <Icon name="heart" color="danger" /> por Meu Tucano</span>
    <div>
      <a href="mailto:suporte@meutucano.com.br">suporte@meutucano.com.br</a>
      <a href="tel:+554735213280">(47) 3521-3280</a>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.TFooter {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  color: $dark;
  font-size: 12px;

  a {
    color: $dark !important;
  }

  a:first-child {
    margin-right: 8px;
    padding-right: 8px;
    border-right: 1px solid $dark;
  }
}
</style>
