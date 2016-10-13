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
                },

                ranking: function() {
                    return Restangular.one(baseUrl + '/ranking').customGET();
                },

                avatar: function(gamification_id, avatar) {
                    return Restangular.one(baseUrl + '/avatar', gamification_id).customPOST({
                        avatar: avatar
                    });
                }
            };
        }
})();