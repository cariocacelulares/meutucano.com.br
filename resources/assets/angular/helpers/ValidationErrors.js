(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ValidationErrors', function() {
            return {
                /**
                 * Pega apenas as mensagens de error
                 *
                 * @param  {Object} response resposta da requisicao na api
                 * @return {Object|null}     array com as mensagens
                 */
                handle: function(response) {
                    var mesages = null;

                    if (response.data.status == 'ValidationFail') {
                        mesages = [];

                        for (var k in response.data) {
                            if (k != 'status') {
                                for (var j in response.data[k]) {
                                    for (var i in response.data[k][j]) {
                                        mesages.push(response.data[k][j][i]);
                                    }
                                }
                            }
                        }
                    }

                    return mesages;
                }
            };
        });
})();
