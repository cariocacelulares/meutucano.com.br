export default {
  getList (params) {
    var promise = new Promise(resolve => {
      setTimeout(() => {

        let data = [
          {
            sku: 384,
            ean: 9182736098231,
            titulo: 'Telefone sem Fio Vtech LYRIX 550 DECT com Ramal',
            custo: 943.70,
            valor: 1999.90,
            estado: 'Novo',
            estoque: {
              pago: 2,
              pendente: 1,
              disponivel: 40
            },
          },
          {
            sku: 453,
            ean: 9185976398231,
            titulo: 'Alcatel Pixi4 Colors Azul ' + (new Date()).toString(),
            custo: 400.22,
            valor: 449.90,
            estado: 'Usado',
            estoque: {
              pago: 0,
              pendente: 5,
              disponivel: 200
            },
          },
        ]

        data = data
          .concat(data)
          .concat(data)
          .concat(data)
          .concat(data)
          .concat(data)
          .concat(data)

        resolve({
          data: data
        })
      }, 1000)
    })

    return promise
  },

  search (term) {
    var promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: []
        })
      }, 1000)
    })

    return promise
  }
}
