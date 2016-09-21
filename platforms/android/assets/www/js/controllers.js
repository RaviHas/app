angular.module('starter.controllers', ['firebase'])

.controller('DashCtrl', function ($scope) {
    screen.unlockOrientation();
})

.controller('ChatsCtrl', ['$scope', '$firebaseArray', '$state', '$rootScope',
        function ($scope, $firebaseArray, $rootScope) {
            screen.unlockOrientation();
            $ionicSideMenuDelegate.canDragContent(true);
            var ref = new Firebase('https://kiddo-56f35.firebaseio.com/');
            var sync = $firebaseArray(ref);
            $scope.chats = sync;
            
            $scope.sendChat = function (chat) {
                $scope.chats.$add({
                    user: 'Ravindu',
                    message: chat.message
                });
                chat.message = "";
            }


            $scope.sendReply = function (chat, reply) {
                chat.reply[1] = {
                    user: 'Rayan',
                    message: reply.message
                };
                $scope.chats.$save(chat).then(function (sync) {
                    sync.key() === chat.$id; // true
                });
                chat.message = "";
                reply.message = "";
            }

            $scope.viewTopic = function (chat, $state) {
                $scope.viewChat = chat
                $state.go('viewChat')
            }
  
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('VirtualclsCtrl', function ($scope, $state) {
    screen.lockOrientation('landscape');

    $scope.$on('$ionicView.leave', function () {
        screen.unlockOrientation();
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
})

.controller('AccountCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
    var init = function () {
        screen.unlockOrientation();
    };
   
    $scope.goToCls = function () {
        $state.go('virtualcls');
        $ionicSideMenuDelegate.canDragContent(false)
        screen.lockOrientation('landscape');
    };

})

.controller('LoginCtrl', function ($scope, $ionicPopup, $state) {
    $scope.login = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template: 'Login Success!'
        });
        $state.go('tab.dash');
    }
    $scope.register = function () {
        $state.go('register');
    }
});
