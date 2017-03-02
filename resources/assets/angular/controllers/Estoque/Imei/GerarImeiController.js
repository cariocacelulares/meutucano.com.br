(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('GerarImeiController', GerarImeiController);

    function GerarImeiController(Imei, toaster, envService, $window, $httpParamSerializer) {
        var vm = this;

        vm.generateLoading = false;
        vm.generate = function() {
            Imei.generate(vm.listSize).then(function(response) {
                var auth = {
                    token: localStorage.getItem("satellizer_token")
                };

                $window.open(envService.read('apiUrl') + '/storage/' + response.path + '/' + response.fileName + '?' + $httpParamSerializer(auth), 'imeiPdf');
            });
        }
    }
})();
