(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .factory('ToasterInterceptor', ToasterInterceptor);


    function ToasterInterceptor($q, toaster) {
        return {
            responseError: function(rejection) {
                if (rejection.data.hasOwnProperty('msg')) {
                    toaster.pop('error', "Houve um problema", rejection.data.msg);
                }
                return $q.reject(rejection);
            }
        };
    }

})();