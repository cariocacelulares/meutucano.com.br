(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Gamification', GamificationModel);

        function GamificationModel(Restangular) {
            var baseUrl = 'gamification';

            return {
                perfil: function(usuario_id) {
                    return Restangular.one(baseUrl + '/perfil', usuario_id || null).customGET();
                }
            };
        }
})();
