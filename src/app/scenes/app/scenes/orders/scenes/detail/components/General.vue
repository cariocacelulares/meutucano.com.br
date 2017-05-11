<template>
  <ContentBox :discret="true" :class="{ grid: true, loading: loading }">
    <div class="grid general">
      <Card header-icon="info" header-text="Detalhes">
        <div class="card-data">
          <span>Data do pedido</span>
          <strong>08/02/1995</strong>
        </div>

        <div class="card-data">
          <span>Método de pagamento</span>
          <strong>Cartão de Crédito (12x)</strong>
        </div>

        <div class="card-data">
          <span>Método de envio</span>
          <strong>Correios PAC</strong>
        </div>
      </Card>

      <Card header-icon="user" header-text="Informações de cliente">
        <div class="grid-2 row-gap-0">
          <div class="card-data">
            <span>Nome do cliente</span>
            <strong><a href="#">Ceiton Souza</a></strong>
          </div>

          <div class="card-data">
            <span>Documento</span>
            <strong>048.137.609.70 <Icon name="paperclip"/></strong>
          </div>

          <div>
            <div class="card-data">
              <span>E-mail de contato</span>
              <strong>cleiton7souza@gmail.com</strong>
            </div>

            <div class="card-data span-2">
              <span>Telefone</span>
              <strong>(47) 3521-3183<!--b><br/>(47) 98898-3927</b--></strong>
            </div>
          </div>

          <div class="card-data address">
            <span>
              Rua Padre Anchieta #200 - Canoas<br/>
              Rio do Sul / SC<br/>
              89160-000<br/>
              Sala 201
            </span>
          </div>
        </div>
      </Card>

      <Card header-icon="list-alt" header-text="Produtos" class="products">
        <table class="discrete-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th class="text-left">Produto</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="#">630</a></td>
              <td class="text-left">
                <p>Fone de ouvido Multilaser Pulse Fun Bluetooth PH218 Azul/Verde</p>
                <b>CA000000000000251</b>
              </td>
              <td>R$119,90</td>
              <td>2</td>
              <td>R$238,80</td>
            </tr>
            <tr>
              <td><a href="#">630</a></td>
              <td class="text-left">
                <p>Fone de ouvido Multilaser Pulse Fun Bluetooth PH218 Azul/Verde</p>
                <b>CA000000000000251</b>
              </td>
              <td>R$119,90</td>
              <td>2</td>
              <td>R$238,80</td>
            </tr>
          </tbody>
        </table>
        <div class="table-values">
          <div class="card-data">
            <span>Subtotal</span>
            <strong>R$1567,90</strong>
          </div>

          <span class="signal">+</span>

          <div class="card-data">
            <span>Valor de frete</span>
            <strong>R$13,90</strong>
          </div>

          <span class="signal">+</span>

          <div class="card-data">
            <span>Taxas</span>
            <strong>R$24,00</strong>
          </div>

          <span class="signal">-</span>

          <div class="card-data">
            <span>Descontos</span>
            <strong>R$0,00</strong>
          </div>

          <span class="signal">=</span>

          <div class="card-data">
            <span>Total</span>
            <strong>R$2001,42</strong>
          </div>
        </div>
      </Card>
    </div>

    <VSeparator :spacing="0" />

    <div class="invoices">
      <strong>Notas fiscais</strong>
      <Card header-icon="file-code-o" header-text="44318/1" :no-footer-sep="true">
        <div slot="header">
          <a href="#" class="text-bold">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-2 no-card-spacing">
          <div class="card-data">
            <span>Emitida em</span>
            <strong>09/04/2017</strong>
          </div>

          <div class="card-data">
            <span>Emitida por</span>
            <strong>Lidiane Martins</strong>
          </div>
        </div>

        <template slot="footer">
          <div class="devolution">
            <span>Devolução em <b>08/02/1995</b></span>
            <div>
              <a href="#"><Icon name="print" /></a>
              <VSeparator :height="10" :spacing="10" />
              <Icon name="times" />
            </div>
          </div>
        </template>
      </Card>

      <Card header-icon="file-code-o" header-text="44318/1">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-2">
          <div class="card-data">
            <span>Emitida em</span>
            <strong>09/04/2017</strong>
          </div>

          <div class="card-data">
            <span>Emitida por</span>
            <strong>Lidiane Martins</strong>
          </div>
        </div>
      </Card>
    </div>

    <div class="shipments">
      <strong>Rastreios</strong>

      <Card header-icon="truck" header-text="PN717347694BR">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-3">
          <div class="card-data">
            <span>Enviado em</span>
            <strong>08/02/1995</strong>
          </div>

          <div class="card-data">
            <span>Prazo</span>
            <strong>2 dias</strong>
          </div>

          <TLabel height="26px" color="warning">Atrasado</TLabel>
        </div>

        <div slot="footer" class="card-footer">
          <div>
            <a href="#" @click.prevent="openLogistic" class="disabled"><Icon name="exchange" /></a>
            <a href="#" @click.prevent="openDevolution"><Icon name="undo" /></a>
            <a href="#" @click.prevent="openIssue"><Icon name="exclamation-triangle" /></a>
          </div>

          <div>
            <a href="#"><Icon name="video-camera" /></a>
            <a href="#"><Icon name="picture-o" /></a>
          </div>
        </div>
      </Card>

      <Card header-icon="truck" header-text="PN717347694BR">
        <div slot="header">
          <a href="#">
            <Icon name="print" color="link" />
          </a>
          <VSeparator :height="10" :spacing="10" />
          <Icon name="times" />
        </div>

        <div class="grid-3">
          <div class="card-data">
            <span>Enviado em</span>
            <strong>08/02/1995</strong>
          </div>

          <div class="card-data">
            <span>Prazo</span>
            <strong>2 dias</strong>
          </div>

          <TLabel height="26px" color="primary">Enviado</TLabel>
        </div>
      </Card>
    </div>

    <Devolution />
    <Logistic />
    <Issue />
  </ContentBox>
</template>

<script>
import Devolution from './general/Devolution'
import Logistic from './general/Logistic'
import Issue from './general/Issue'

export default {
  components: {
    Devolution,
    Logistic,
    Issue,
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    openDevolution() {
      this.$root.$emit('show::modal-Devolution')
    },

    openLogistic() {
      this.$root.$emit('show::modal-Logistic')
    },

    openIssue() {
      this.$root.$emit('show::modal-Issue')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

$gap: 20px;

.ContentBox {
  grid-template-columns: calc(52% - 21px) 1px calc(24% - 40px) 24%;
  grid-gap: $gap;
  grid-auto-flow: row;

  .grid.general {
    grid-template-columns: 200px calc(100% - 200px - #{$gap});
    grid-gap: $gap;
    grid-auto-flow: row;

    .address * {
      color: $dark;
      font-size: 13px;
      line-height: 1.3;
    }

    .products {
      grid-column-end: span 2;
    }
  }

  .invoices,
  .shipments {
    display: flex;
    flex-direction: column;

    .Card:first-of-type {
      margin-top: 10px;
    }

    > strong {
      font-size: 14px;
      color: $darker;
    }

    > * {
      &:not(:first-child) {
        margin-top: $gap;
      }
    }
  }

  .invoices {
    .devolution {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0;
      height: 35px;
      padding: 0 20px;
      font-size: 12px;
      color: $white;
      background-color: #C9403C;
      box-shadow: $defaultShadow;

      a {
        color: $white;
      }
    }
  }

  .shipments {
    .TLabel {
      margin-top: 4px;
    }

    .card-footer {
      padding: 15px 20px;

      > div > :not(:first-child) {
        margin-left: 20px;
      }

      .disabled,
      [disabled] {
        opacity: .5;
      }

      a {
        color: $dark;
      }
    }
  }

  .general .card-data:not(:last-child) {
    margin-bottom: 20px;
  }

  .products {
    .table-values {
      display: flex;
      align-items: center;
      padding-top: 20px;

      .card-data {
        margin-bottom: 0;
      }

      > * {
        flex-grow: 1;
      }

      .signal {
        color: $dark;
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}
</style>
