(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', 'UserService', 'CurrencyService']

    function HomeController($rootScope, UserService, CurrencyService) {
        var vm = this;

        vm.user = null;
        vm.init = init;
        vm.currencyUpdateDate = null;
        vm.$onInit = vm.init;

        function init() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

            CurrencyService.getCurrentCurrencyData()
                .then(function (data) {
                    vm.currencyUpdateDate = data.publicationDate;
                })
                .catch(function (err) {
                    console.log(err)
                });
        }

        $rootScope.$on('BoughtCurrency', function () {
            vm.init()
        });
    }

})();