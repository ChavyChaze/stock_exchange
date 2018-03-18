(function () {
    'use strict';

    angular
        .module('app')
        .factory('CurrencyService', CurrencyService);

    function CurrencyService($http, $q) {
        let service = {};

        service.getCurrentCurrencyData = getCurrentCurrencyData;

        return service;

        function getCurrentCurrencyData() {
            return $http.get('/api/currency').then(handleSuccess, handleError);
        }

        // private
        function handleSuccess(res) {
            // console.log(res.data);
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }        
    }
})();
