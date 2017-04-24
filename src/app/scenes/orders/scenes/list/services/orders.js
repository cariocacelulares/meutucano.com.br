export default {
  getList (params) {
    var promise = new Promise(resolve => {
      setTimeout(() => {

        let data = [
          {
            id: 1,
            codigo_marketplace: '02-0987192201',
            marketplace: 'Mercado Livre',
            cliente: {
              id: 1,
              nome: 'Cleiton Souza',
            },
            valor: 1999.90,
            data: '2017-02-08 07:45:52',
            status: {
              code: 1,
              description: 'Aprovado',
            },
          },
          {
            id: 2,
            codigo_marketplace: '02-0912392201',
            marketplace: 'Site',
            cliente: {
              id: 2,
              nome: 'Diego Schell Fernandes',
            },
            valor: 455.92,
            data: '2017-03-22 22:13:42',
            status: {
              code: 2,
              description: 'Cancelado',
            },
          },
          {
            id: 3,
            codigo_marketplace: '02-0965492201',
            marketplace: 'B2W',
            cliente: {
              id: 3,
              nome: 'Cleiton Luis de Souza',
            },
            valor: 300,
            data: '2016-12-25 23:59:59',
            status: {
              code: 3,
              description: 'Completo',
            },
          },
          {
            id: 4,
            codigo_marketplace: '02-1237192201',
            marketplace: 'CNOVA',
            cliente: {
              id: 4,
              nome: 'Diego Schell',
            },
            valor: 1999.90,
            data: '2018-01-14 09:32:59',
            status: {
              code: 1,
              description: 'Aprovado',
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
