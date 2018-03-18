(function () {
    'use strict';

    angular
        .module('app')
        .component('sellCurrency', {
            templateUrl: 'app-components/sell-currency/sellCurrency.html',
            controller: SellCurrencyController
        });

    SellCurrencyController.$inject = ['$rootScope', 'CurrencyService', 'UserService', '$uibModal', 'blockUI']

    function SellCurrencyController($rootScope, CurrencyService, UserService, $uibModal, blockUI) {
        const vm = this;

        vm.user = null;
        vm.currencyData = null;
        vm.currencyExchangeData = null;
        vm.userWalletData = null;
        vm.getCurrencyExchangeData = getCurrencyExchangeData;
        vm.sellCurrency = sellCurrency;
        vm.init = init;

        vm.$onInit = init;

        function init() {
            UserService.GetCurrent()
                .then(function (user) {
                    vm.user = user;
                    vm.userWalletData = vm.user.user;
                    blockUI.stop();
                })
                .catch(function (err) {
                    blockUI.start();
                    console.log(err);
                });

            CurrencyService.getCurrentCurrencyData()
                .then(function (data) {
                    vm.currencyData = data.items;
                    vm.getCurrencyExchangeData();
                    blockUI.stop();
                })
                .catch(function (err) {
                    blockUI.start();
                    console.log(err);
                });
        };

        function getCurrencyExchangeData() {
            vm.currencyExchangeData = vm.currencyData.map(function (item) {
                item['userUnits'] = vm.userWalletData[item.code.toLowerCase()];

                item.value = item.userUnits * item.price;
                
                return item;
            });
        };

        function sellCurrency(item) {
            let pickedCurrency = item;

            $uibModal.open({
                component: 'sellModal',
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