(function () {
    'use strict';

    angular
        .module('app')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$window', 'UserService', 'FlashService']

    function AccountController($window, UserService, FlashService) {
        const vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) { // get current user
                vm.user = user;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Data updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();