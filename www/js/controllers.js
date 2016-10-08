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

.controller('ChatsCtrl', ['$scope', '$firebaseArray', '$state', '$stateParams', '$rootScope',
        function ($scope, $firebaseArray, $rootScope, $state) {
            screen.unlockOrientation();

            var ref = new Firebase('https://kiddo-56f35.firebaseio.com/chat');
            var sync = $firebaseArray(ref);
            $scope.chats = sync;

            $scope.sendChat = function (chat) {
                $scope.chats.$add({
                    user: 'Ravindu',
                    message: chat.message,
                });
                chat.message = "";
            }


            $scope.viewChat = function (chat,$state) {
                $state.go('virtualcls');
                console.log(chat);

            }

}])

.controller('ChatDetailCtrl', ['$scope', '$firebaseArray', '$state', '$stateParams', '$rootScope',
    function ($scope, $firebaseArray, $rootScope, $stateParams) {
        var ref = new Firebase('https://kiddo-56f35.firebaseio.com/chat');
        var sync = $firebaseArray(ref);
        sync.$loaded().then(function (sync) {
            $scope.chats = sync.$getRecord(($stateParams.chatId));
        });

        $scope.sendReply = function (chats, reply) {

            var vreply = {
                user: 'Rayan',
                message: reply.message
            };
            try{
                chats.reply.push(vreply)
            }
            catch (err) {
                var arr = [];
                arr.push(vreply);
                chats.push("reply", arr);
            }
            $scope.chats.$save(chat).then(function (sync) {
                sync.key() === chat.$id; // true
            });
            chat.message = "";
            reply.message = "";
        }


}])


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



    .controller('storybookCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
        screen.lockOrientation('landscape');

        $scope.login = function () {
            console.log("adfsfasf")
            $state.go('storybook');
        }

        $scope.$on('$ionicView.leave', function () {
            screen.unlockOrientation();
            $ionicSideMenuDelegate.canDragContent(true);
        });

    })

        .controller('storybookreaderCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
            screen.lockOrientation('landscape');
            $ionicSideMenuDelegate.canDragContent(true);

            $scope.options = {
                loop: false,
                effect: 'fade',
                speed: 500,
            }

            $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
                // data.slider is the instance of Swiper
                $scope.slider = data.slider;
            });

            $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
                console.log('Slide change is beginning');
            });

            $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
                // note: the indexes are 0-based
                $scope.activeIndex = data.activeIndex;
                $scope.previousIndex = data.previousIndex;
            });

            $scope.$on('$ionicView.leave', function () {
                screen.unlockOrientation();
                $ionicSideMenuDelegate.canDragContent(true);
            });

        })
