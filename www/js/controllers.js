angular.module('starter.controllers', ['firebase'])

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.factory('Child', ['$firebaseArray', function ($firebaseArray) {
    var ChildRef = new Firebase('https://kiddo-56f35.firebaseio.com/children');
    return $firebaseArray(ChildRef);
}])

.factory('User', ['$firebaseArray', function ($firebaseArray) {
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


            $scope.viewChat = function (chat, $state) {
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
            try {
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
       // screen.unlockOrientation();
       // $ionicSideMenuDelegate.canDragContent(true);
    });

})

.controller('AccountCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
    var init = function () {
        screen.unlockOrientation();
    };
    $scope.$on('$ionicView.enter', function () {
        screen.unlockOrientation();
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.goToCls = function () {
        $state.go('virtualcls');
        $ionicSideMenuDelegate.canDragContent(false)
        screen.lockOrientation('landscape');
    };

})



    .controller('storybookCtrl', ['$scope', '$firebaseArray', '$state', '$stateParams', '$rootScope',
	  function ($scope, $firebaseArray, $state, $rootScope) {
	      screen.lockOrientation('landscape');

	      var ref = new Firebase('https://kiddo-56f35.firebaseio.com/storybook');
          var sync = $firebaseArray(ref);
          $scope.storybooks = sync;

          $scope.viewBook = function (storyBook) {
              $state.go('storybookcontent', { obj: storyBook }, {reload:true});
              console.log(storyBook);
          }

	  }])

    .controller('storybookcontentCtrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$rootScope',
        function ($scope, $state, $stateParams, $ionicHistory) {
            screen.lockOrientation('landscape');
            $scope.storybook = $stateParams.obj;
         
        $scope.readBook = function (Book) {
            $state.go('storybookreader', { book: Book });
            console.log(Book);
        } 

      }])

        .controller('storybookreaderCtrl',['$scope', '$state', '$stateParams', '$ionicSlideBoxDelegate',
            function ($scope, $state, $stateParams, $ionicSlideBoxDelegate) {
            screen.lockOrientation('landscape');
            $scope.book = $stateParams.book;
            
            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };

            $scope.next = function () {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function () {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.backStoryContent = function (Story) {
                $state.go('storybookcontent', { obj: Story });
            }

            $scope.backStoryBooks = function () {
                $state.go('storybook');
            }

        }])

/*------------------------------------------login controller-------------------------------------------------*/
        .controller('LoginCtrl', function ($scope, $ionicPopup, $state, Child, User) {

            $scope.user = User;
            $scope.child = Child;

            $scope.login = function (data) {

                var email = data.username;
                var pass = data.password;
                console.log("Email:", email);
                console.log("pass:", pass);

                var user = firebase.auth().signInWithEmailAndPassword(email, pass).then(function (user) {

                    console.log('logged in:', user);
                    $state.go('tab.dash');
                    console.log('user', user.uid);
                    console.log('fkjkjkj', firebase.auth().currentUser);

                }).catch(function (error) {
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

            $scope.addChildAccount = function (data) {

                $scope.child.$add({
                    username: data.username,
                    name: data.name,
                    grade: data.grade,
                    password: data.password
                });

                $scope.user.$add({
                    username: data.username,
                    password: data.password,
                    type: "child"
                });

                console.log(data);
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Child Account Successfully Created!'
                });
                $state.go('tab.dash');
            };//$scope.addChildAccount

            $scope.addUserEmail = function (data) {

                var email = data.email;
                var pass = data.password;
                var name = data.username;

                console.log("Email:", email);
                console.log("pass:", pass);
                console.log("name:", name);

                firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {

                    $state.go('tab.dash');

                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Invalid SignUp',
                        template: errorCode
                    });//alert
                    console.log(errorCode);

                });

            };//$scope.addUserEmail

            $scope.userLogged = function () {
                console.log("hjhjhjk--------------------");
            }
        })
   .controller('classroomCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray','$ionicHistory', '$rootScope',
        function ($scope, $state, $stateParams, $firebaseArray,$ionicHistory, $rootScope) {
            screen.lockOrientation('landscape');
            var ref = new Firebase('https://kiddo-56f35.firebaseio.com/course');
            var sync = $firebaseArray(ref);
            $scope.courses = sync;
            $scope.grade = $stateParams.grade;
            $scope.subject = $stateParams.sub;

            console.log($scope.course);

            $scope.viewcourse = function (Course) {
                $state.go('course', { pcourse: Course });
                console.log('CourseTogo------>', Course);
            }


        }])
    .controller('courseCtrl', ['$scope', '$state', '$stateParams','$ionicHistory',
        function ($scope, $state, $stateParams, $ionicHistory) {
            screen.lockOrientation('landscape');          
            $scope.course = $stateParams.pcourse;
            console.log('CourseTocome------>', $scope.course);


        }]);
