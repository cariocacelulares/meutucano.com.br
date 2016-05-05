(function() {
    'use strict';

    ToasterInterceptor.$inject = ["$q", "toaster"];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvYXN0ZXJJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxzQkFBQTs7O0lBR0EsU0FBQSxtQkFBQSxJQUFBLFNBQUE7UUFDQSxPQUFBO1lBQ0EsZUFBQSxTQUFBLFdBQUE7Z0JBQ0EsSUFBQSxVQUFBLEtBQUEsZUFBQSxRQUFBO29CQUNBLFFBQUEsSUFBQSxTQUFBLHFCQUFBLFVBQUEsS0FBQTs7Z0JBRUEsT0FBQSxHQUFBLE9BQUE7Ozs7O0tBS0EiLCJmaWxlIjoic2VydmljZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZmFjdG9yeSgnVG9hc3RlckludGVyY2VwdG9yJywgVG9hc3RlckludGVyY2VwdG9yKTtcblxuXG4gICAgZnVuY3Rpb24gVG9hc3RlckludGVyY2VwdG9yKCRxLCB0b2FzdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVqZWN0aW9uLmRhdGEuaGFzT3duUHJvcGVydHkoJ21zZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiSG91dmUgdW0gcHJvYmxlbWFcIiwgcmVqZWN0aW9uLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
