angular.module('starter.controllers', ['firebase'])

.factory('Child', ['$firebaseArray', function($firebaseArray) {
  var ChildRef = new Firebase('https://kiddo-56f35.firebaseio.com/children');
  return $firebaseArray(ChildRef);
}])

.factory('User', ['$firebaseArray', function($firebaseArray) {
  var UserRef = new Firebase('https://kiddo-56f35.firebaseio.com/users');
  return $firebaseArray(UserRef);
}])

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

.controller('LoginCtrl', function ($scope, $ionicPopup, $state, Child,User) {

    $scope.user=User;
    $scope.child = Child;

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

    $scope.addChildAccount = function (data) {

      $scope.child.$add({
        username: data.username,
        name:data.name ,
        grade:data.grade,
        password:data.password
      });

      $scope.user.$add({
        username: data.username,
        password: data.password,
        type:"child"
      });
      console.log("888888888888888888888888888888888888888888888888888888888888");
      console.log(data);
      var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Child Account Successfully Created!'
      });
      $state.go('tab.dash');

    }

    $scope.addUser = function () {

      $scope.user.$add({
        username: "ayo.chamain@gmail.com",
        password:"123456",
        type:"parent"
      });

      var alertPopup = $ionicPopup.alert({
          title: 'Alert',
          template: 'Account Created!'
      });

      $state.go('tab.dash');

    };


});
