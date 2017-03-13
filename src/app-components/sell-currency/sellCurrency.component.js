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
        var vm = this;

        vm.user = null;
        vm.currencyData = null;
        vm.cantorData = null;
        vm.userWalletData = null
        vm.getCantorData = getCantorData;
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
                    console.log(err)
                });

            CurrencyService.getCurrentCurrencyData()
                .then(function (data) {
                    vm.currencyData = data.items;
                    vm.getCantorData()
                    blockUI.stop();
                })
                .catch(function (err) {
                    blockUI.start();
                    console.log(err)
                });
        };

        function getCantorData() {
            vm.cantorData = vm.currencyData.map(function (item) {
                item['userUnits'] = vm.userWalletData[item.code.toLowerCase()]

                if (item.unit > 1) {
                    item.value = (item.userUnits / item.unit) * item.sellPrice;
                } else {
                    item.value = item.userUnits * item.sellPrice;
                }

                return item;
            });
        };


        function sellCurrency(item) {
            var pickedCurrency = item;

            $uibModal.open({
                component: 'sellModal',
                resolve: {
                    modalData: function () {
                        return pickedCurrency;
                    }
                }
            }).result.then(function (result) {
                vm.init();
                $rootScope.$broadcast('BoughtCurrency')
            }, function (reason) {
                console.log('reason was ->')
                console.log(reason)
            })
        };


        $rootScope.$on('BoughtCurrency', function () {
            vm.init()
        });

    }
})();