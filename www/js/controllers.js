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
            $scope.cuser = firebase.auth().currentUser.displayName;

            $scope.sendChat = function (chat) {
                console.log(firebase.auth().currentUser);
                $scope.chats.$add({
                    user: firebase.auth().currentUser.displayName,
                    message: chat.message,
                });
                chat.message = "";
            }


            $scope.viewChat = function (chat, $state) {
                $state.go('virtualcls');
                console.log(chat);

            }

            $scope.deletechat = function (chat) {
                var ref = new Firebase('https://kiddo-56f35.firebaseio.com/replys');
                var sync = $firebaseArray(ref);
                $scope.replys = sync;
                $scope.chats.$remove(chat);
                $scope.replys.$remove(replys.$indexFor(chat.$id));
            };

        }])

.controller('ChatDetailCtrl', ['$scope', '$firebaseArray', '$state', '$stateParams', '$rootScope',
    function ($scope, $firebaseArray, $rootScope, $stateParams) {
        var ref = new Firebase('https://kiddo-56f35.firebaseio.com/chat');
        var sync = $firebaseArray(ref);
        sync.$loaded().then(function (sync) {
            $scope.chats = sync.$getRecord(($stateParams.chatId));
            console.log($scope.chats);
        });
        $scope.cuser = firebase.auth().currentUser.displayName;
        var ref = new Firebase('https://kiddo-56f35.firebaseio.com/replys');
        var sync = $firebaseArray(ref);
        $scope.replys = sync;

        $scope.sendReply = function (chats, reply) {

            $scope.replys.$add({
                    chat:chats.$id,
                    user: firebase.auth().currentUser.displayName,
                    reply: reply.message,
                });
            reply.message = "";
        }
        $scope.deletereply = function (reply) {
            $scope.replys.$remove(reply);
        };
        

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
        .controller('LoginCtrl', function ($scope,$rootScope,$ionicPopup, $state, Child,User) {

            $scope.user = User;
            $scope.child = Child;
            $rootScope.username = null;

            $scope.currentUser1 = null;

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

                        $rootScope.username=firebase.auth().currentUser.displayName;


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
            $scope.currentUser1= firebase.auth().currentUser;
            console.log('----------------------',$scope.currentUser1.displayName);

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
                console.log("name:", name);

                firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {

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

            $scope.quize = function (Course) {
                $state.go('quiz');
                console.log('quizeTogo------>', Course);
            }

        }])

.factory('quizFactory', ['$firebaseArray', function ($firebaseArray) {

    var ref = new Firebase('https://kiddo-56f35.firebaseio.com/question');
    var sync = $firebaseArray(ref);
    var questi = sync;
    questi.$loaded()
    .then(function () {
        angular.forEach(questi, function (quest) {
            console.log(quest);
        })
    });
    var questions = [
		{
		    question: "Which is the largest country in the world by population?",
		    options: ["India", "USA", "China", "Russia"],
		    answer: 2
		},
		{
		    question: "When did the second world war end?",
		    options: ["1945", "1939", "1944", "1942"],
		    answer: 0
		},
		{
		    question: "Which was the first country to issue paper currency?",
		    options: ["USA", "France", "Italy", "China"],
		    answer: 3
		},
		{
		    question: "Which city hosted the 1996 Summer Olympics?",
		    options: ["Atlanta", "Sydney", "Athens", "Beijing"],
		    answer: 0
		},
		{
		    question: "Who invented telephone?",
		    options: ["Albert Einstein", "Alexander Graham Bell", "Isaac Newton", "Marie Curie"],
		    answer: 1
		}
    ];

    return {
        getQuestion: function (id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
}])

.directive('quiz', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'templates/template.html',
        link: function (scope, elem, attrs) {
            scope.start = function () {
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
            };

            scope.reset = function () {
                scope.inProgress = false;
                scope.score = 0;
            }

            scope.getQuestion = function () {
                var q = quizFactory.getQuestion(scope.id);
                if (q) {
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            };

            scope.checkAnswer = function () {
                if (!$('input[name=answer]:checked').length) return;

                var ans = $('input[name=answer]:checked').val();

                if (ans == scope.options[scope.answer]) {
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    scope.correctAns = false;
                }

                scope.answerMode = false;
            };

            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }

            scope.reset();
        }
    }
});
