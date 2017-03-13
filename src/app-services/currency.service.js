(function () {
    'use strict';

    angular
        .module('app')
        .factory('CurrencyService', CurrencyService);

    function CurrencyService($http, $q) {
        var service = {};

        service.getCurrentCurrencyData = getCurrentCurrencyData;

        return service;

        function getCurrentCurrencyData() {
            return $http.get('/api/currency').then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
