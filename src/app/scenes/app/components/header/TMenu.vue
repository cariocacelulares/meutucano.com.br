<template>
  <ul class="TMenu">
    <li>
      <router-link :to="{ path: 'dashboard' }">
        <Icon name="home" text="Início" />
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'orders' }">
        <Icon name="shopping-cart" text="Vendas" />
      </router-link>
      <ul class="sub-menu">
        <li><strong>Pedidos</strong></li>
        <li><router-link :to="{ name: 'orders' }">Pedidos por mês</router-link></li>
        <li><router-link :to="{ name: 'products' }">Faturamento</router-link></li>

        <li><strong>Clientes</strong></li>
        <li><router-link :to="{ name: 'customers' }">Catálogo de clientes</router-link></li>

        <li><strong>Logística</strong></li>
        <li><router-link :to="{ name: 'products' }">Centro logístico</router-link></li>
      </ul>
    </li>
    <li>
      <router-link :to="{ name: 'products' }">
        <Icon name="tags" text="Produtos" />
      </router-link>
      <ul class="sub-menu">
        <li><strong>Produtos</strong></li>
        <li><router-link :to="{ name: 'products' }">Catálogo de produtos</router-link></li>
        <li><router-link :to="{ name: 'brands' }">Marcas</router-link></li>
        <li><router-link :to="{ name: 'lines' }">Linhas</router-link></li>

        <li><strong>Estoque</strong></li>
        <li><router-link :to="{ name: 'products' }">Retiradas</router-link></li>
        <li><router-link :to="{ name: 'products' }">Depósitos</router-link></li>
        <li><router-link :to="{ name: 'products' }">Baixas manuais</router-link></li>
        <li><router-link :to="{ name: 'products' }">Defeitos</router-link></li>
      </ul>
    </li>
    <li>
      <a href="#" @click.prevent>
        <Icon name="suitcase" text="Compras" />
      </a>
      <ul class="sub-menu">
        <li><strong>Entradas</strong></li>
        <li><router-link :to="{ name: 'products' }">Compras</router-link></li>
        <li><router-link :to="{ name: 'products' }">Fornecedores</router-link></li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.TMenu {
  line-height: 60px;
  font-size: 13px;
  color: $darker;

  .Icon {
    margin-right: 5px;
  }

  > li {
    position: relative;
    display: inline-block;
    list-style: none;
    padding: 0 12px;

    a {
      font-weight: bold;
      color: inherit;
      transition: color linear 100ms;
    }

    &:hover .sub-menu,
    &:focus .sub-menu {
      visibility: visible;
      opacity: 1;
      z-index: 999;
    }
  }
}
</style>
