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
                chats.reply = arr;
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

    .controller('storybookcontentCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
        screen.lockOrientation('landscape');

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

/*------------------------------------------login controller-------------------------------------------------*/
        .controller('LoginCtrl', function ($scope,$ionicPopup, $state, Child,User) {

                  $scope.user=User;
                  $scope.child = Child;

                  $scope.login = function(data) {

                    var email = data.username;
                    var pass = data.password;
                    console.log("Email:", email);
                    console.log("pass:", pass);

                    var user =firebase.auth().signInWithEmailAndPassword(email, pass).then(function(user){

                        console.log('logged in:', user);
                        $scope.currentUser1=user;
                        $state.go('tab.dash');
                        //console.log('user',user.uid);
                        var userId = user.uid;
                        console.log(userId);

                        var ref  = firebase.database().ref("users");
                        console.log(firebase.auth().currentUser.displayName);
                        console.log(firebase.auth().currentUser.photoURL);



                        //console.log('current---------------',currentLoggedUser);
                        //console.log('fkjkjkj',firebase.auth().currentUser);


                    }).catch(function(error) {
                                    // Handle Errors here.
                              var errorCode = error.code;
                              var errorMessage = error.message;
                              var alertPopup = $ionicPopup.alert({
                                  title: 'Invalid Login',
                                  template: errorMessage
                              });//alert

                    });//catch

          }//$scope.login

          $scope.register = function () {

            $state.go('register');

          }//$scope.register

/*--------------------------------------------add child --------------------------------------------------------*/
          $scope.addChildAccount = function (data) {
            console.log('user88888888888:',firebase.auth().currentUser.uid);
            var fb = new Firebase("https://kiddo-56f35.firebaseio.com/child/");
          //  var sync = $firebaseArray(fb);
            var parent = firebase.auth().currentUser.uid;
            var name=data.name1;
            var grade = data.grade;
            console.log('name is ',name);
            console.log('grade :',grade);

            var a = firebase.auth().currentUser;
            console.log(a);

            fb.push({
              parent:parent,
              name:name,
              grade:grade
      });



          };//$scope.addChildAccount

          $scope.addUserEmail = function (data) {

                var email = data.email;
                var pass = data.password;
                var name = data.username;

                console.log("Email:", email);
                console.log("pass:", pass);
                console.log("name:", name );

                firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user){

                    var user1 = firebase.auth().currentUser;

                    console.log(user1.displayName);
                    user1.updateProfile({
                      displayName: name,
                      photoURL: "https://example.com/jane-q-user/profile.jpg"
                    }).then(function() {
                      console.log(firebase.auth().currentUser.displayName);
                    }, function(error) {
                      // An error happened.
                      var alertPopup = $ionicPopup.alert({
                          title: 'Invalid SignUp',
                          template: errorMessage
                      });//alert
                    });

                    $state.go('tab.dash');


                })
                .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                var alertPopup = $ionicPopup.alert({
                    title: 'Invalid SignUp',
                    template: errorMessage
                });//alert
                console.log(errorCode);

            });

          };//$scope.addUserEmail

          $scope.userLogged = function()
          {
            console.log("hjhjhjk--------------------");
          }
        });
