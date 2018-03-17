(function () {
    'use strict';

    angular
        .module('app')
        .component('buyCurrency', {
            templateUrl: 'app-components/buy-currency/buyCurrency.html',
            controller: BuyCurrencyController
        });

    BuyCurrencyController.$inject = ['$rootScope', 'CurrencyService', 'UserService', '$uibModal', 'blockUI']

    function BuyCurrencyController($rootScope, CurrencyService, UserService, $uibModal, blockUI) {
        const vm = this;

        vm.currencyData = null;
        vm.currencyUpdateDate = null;
        vm.intervalId = null;
        vm.currencyExchangeWalletData = null;
        vm.init = init;
        vm.getCurrencyExchangeData = getCurrencyExchangeData;
        vm.intervalUpdateCurrency = intervalUpdateCurrency;
        vm.buyCurrency = buyCurrency;

        vm.intervalUpdateCurrency();

        function init() {
            UserService.GetCurrent()
                .then(function (user) {
                    vm.currencyExchangeWalletData = user.currencyExchange;
                    blockUI.stop();
                })
                .catch(function (err) {
                    blockUI.start();
                    console.log(err);
                });

            CurrencyService.getCurrentCurrencyData()
                .then(function (data) {
                    blockUI.stop();
                    vm.currencyData = data.items;
                    vm.currencyUpdateDate = data.publicationDate;
                    vm.getCurrencyExchangeData();
                })
                .catch(function (err) {
                    blockUI.start();
                    console.log(err);
                });
        };

        function intervalUpdateCurrency() {
            vm.init();
            $rootScope.$broadcast('BoughtCurrency');
        };

        setInterval(vm.intervalUpdateCurrency, 30000);

        function getCurrencyExchangeData() {
            vm.currencyExchangeData = vm.currencyData.map(function (item) {
                item['currencyExchangeUnit'] = vm.currencyExchangeWalletData[item.code.toLowerCase()];
                return item;
            });
        };

        function buyCurrency(item) {
            let pickedCurrency = item;

            $uibModal.open({
                component: 'buyModal',
                resolve: {
                    modalData: function () {
                        return pickedCurrency;
                    }
                }
            }).result.then(function (result) {
                vm.init();
                $rootScope.$broadcast('BoughtCurrency');
            }, function (reason) {
                console.log('the reason is ');
                console.log(reason);
            })
        };

        $rootScope.$on('BoughtCurrency', function () {
            vm.init();
        });
    }
})();