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
        var ref = new Firebase('https://kiddo-56f35.firebaseio.com/replys');
        var sync = $firebaseArray(ref);
        $scope.replys = sync;

        $scope.sendReply = function (chats, reply) {

            $scope.replys.$add({
                    chat:chats.$id,
                    user: 'Ravindu',
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

.controller('AccountCtrl',function ($scope, $state,$firebaseArray, $ionicSideMenuDelegate) {

  var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child');
  var sync=$firebaseArray(ref);

  $scope.children=sync;
  $scope.userId=firebase.auth().currentUser.uid;
  $scope.childNames=[];
  $scope.children.$loaded()
    .then(function () {
        angular.forEach($scope.children, function (c) {
            if (c.parent==$scope.userId) {
                $scope.childNames.push(c);
                console.log('countdsddsd', $scope.childNames);
                $scope.default=$scope.childNames[0];
                console.log('default------------->',$scope.childNames[0]);
            }
        })});


  console.log($scope.children);

    var init = function () {
      screen.unlockOrientation();


    };
    $scope.$on('$ionicView.enter', function () {
        //screen.unlockOrientation();
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.goToCls = function () {
        $state.go('virtualcls');
        $ionicSideMenuDelegate.canDragContent(false)
        //screen.lockOrientation('landscape');
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
            $rootScope.profileImage = null;
          //  $rootScope.username=firebase.auth().currentUser.displayName;

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
                        $rootScope.profileImage=firebase.auth().currentUser.photoURL;

                        var ref  = firebase.database().ref("users");
                        console.log(firebase.auth().currentUser.displayName);
                        console.log(firebase.auth().currentUser.photoURL);


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
            $rootScope.username=firebase.auth().currentUser.displayName;
            console.log('----------------------',$scope.currentUser1.displayName);

            fb.push({
              parent:parent,
              name:name,
              grade:grade,
              image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAc4AAAHOCAIAAACehH7nAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNTgwMTE3NDA3MjA2ODExODA4MzkyM0JERUMzODk4NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RjM0Mzc5MUE3NDkxMUUyQjNDRTg5RDNFQjJEOEE0QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RjM0Mzc5MEE3NDkxMUUyQjNDRTg5RDNFQjJEOEE0QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMTgwODM5MjNCREVDMzg5ODQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDU4MDExNzQwNzIwNjgxMTgwODM5MjNCREVDMzg5ODQiLz4gPC9yZGY6RGVzY3Jp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"
            });
            $state.go('manageChild');


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
                      photoURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjZDMDU5RDFCRTk1MTFFMkEwQ0JERjVFRkVBQjBDM0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjZDMDU5RDJCRTk1MTFFMkEwQ0JERjVFRkVBQjBDM0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNkMwNTlDRkJFOTUxMUUyQTBDQkRGNUVGRUFCMEMzRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNkMwNTlEMEJFOTUxMUUyQTBDQkRGNUVGRUFCMEMzRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppv8kuMAAAviSURBVHja7N3vcdNI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"
                    }).then(function() {
                      console.log('jkjkjk',firebase.auth().currentUser.displayName);
                      $rootScope.username=firebase.auth().currentUser.displayName;
                      $rootScope.profileImage=firebase.auth().currentUser.photoURL;
                      $state.go('tab.dash');

                    }, function(error) {
                      // An error happened.
                      var alertPopup = $ionicPopup.alert({
                          title: 'Invalid SignUp',
                          template: errorMessage
                      });//alert
                    });
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
            $scope.logout = function(){

              var confirmPopup = $ionicPopup.confirm({
                 title: 'Confirm Logout',
                 template: 'Are you sure you want to logout from kiddo?'
               });

               confirmPopup.then(function(res) {
                 if(res) {
                   firebase.auth().signOut().then(function() {
                      $state.go('login');
                      console.log("logged out");
                    }, function(error) {
                      console.log(error);
                    });
                 } else {
                   console.log('You are not sure');
                 }
               });

            };

            $scope.userLogged = function () {
                console.log("hjhjhjk--------------------");
            };
        })
   .controller('ChildCtrl',['$scope','$firebaseArray','$ionicPopup','$firebaseObject',
   function($scope,$firebaseArray,$ionicPopup,$firebaseObject){

     var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child');
     var sync=$firebaseArray(ref);

     $scope.children=sync;
     $scope.userId=firebase.auth().currentUser.uid;
     console.log(sync);
     console.log(firebase.auth().currentUser.uid);

       $scope.showEditPopup = function(id) {

           var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child/'+id);
           $scope.editData=$firebaseObject(ref);
           console.log('----------------------------->',$scope.editData);
          // Custom popup
            var myPopup = $ionicPopup.show({
              templateUrl: 'templates/edit-profile-popup.html',
              title: 'Edit profile',
              scope: $scope,
              buttons: [
                { text: 'Cancel', onTap: function(e) { return true; } },
                {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child/'+id);
                    ref.update({
                      name:$scope.editData.name,
                      grade:$scope.editData.grade
                    });                    //return scope.data.response;
                  }
                },
              ]
            }).then(function(password) {
              //console.log('Got wifi password', password);
            });
              myPopup.then(function(res) {
                 console.log('Tapped!', res);
              });
     };//edit child

     $scope.showDeletePopup=function(id){
       var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child/'+id);
       $scope.editData=$firebaseObject(ref);
       console.log('----------------------------->',$scope.editData);
       var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this child account?',
       });
       confirmPopup.then(function(res) {
          if (res) {
             var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child/'+id);
             ref.remove();
             $state.go('tab.dash');

          } else {
             console.log('You clicked on "Cancel" button');
          }
       });
     };//delete child
   }])
   .controller('ParentProfileCtrl',['$scope','$firebaseArray','$ionicPopup','$firebaseObject','$state',
      function($scope,$firebaseArray,$ionicPopup,$firebaseObject,$state){

        $scope.name=firebase.auth().currentUser.displayName;
        $scope.profileImage=firebase.auth().currentUser.photoURL;
        $scope.email=firebase.auth().currentUser.email;

        console.log($scope.name);
        console.log($scope.profileImage);
        console.log($scope.email);

        $scope.editName = function(){
            console.log("edit name called---------------->");
            $scope.name=firebase.auth().currentUser.displayName;
            $scope.editUserName=$scope.name;

            var myPopup = $ionicPopup.show({
              templateUrl: 'templates/paren-username-popup.html',
              title: 'Edit my name',
              scope: $scope,

              buttons: [
                { text: 'Cancel' },
              ]
            });

            $scope.editUserDisplayName = function(editUserName){

              var user = firebase.auth().currentUser;

              var username = editUserName;
              console.log(username);

              user.updateProfile({
                            displayName:username
                          }).then(function() {
                            console.log(firebase.auth().currentUser.displayName);
                            myPopup.close();
                            $state.go('parentProfile');
                          }, function(error) {
                            // An error happened.
                            console.log(error);
              });

            };
        };

        $scope.changePassword = function(){

          var myPopup = $ionicPopup.show({
            templateUrl: 'templates/paren-password-popup.html',
            title: 'Change my password',
            scope: $scope,

            buttons: [
              { text: 'Cancel' },
            ]
          });

        };
   }])

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
    .controller('courseCtrl', ['$scope','$rootScope', '$state', '$stateParams','$ionicHistory','$firebase','$firebaseArray',
        function ($scope,$rootScope, $state,  $stateParams, $ionicHistory, $firebase, $firebaseArray) {
            screen.lockOrientation('landscape');
            $scope.course = $stateParams.pcourse;
            console.log('CourseTocome------>', $scope.course);
            $rootScope.grade = $scope.course.grade;
            $rootScope.subject = $scope.course.subject;
            $rootScope.title = $scope.course.title;


            $scope.quize = function (Course) {
                $state.go('quiz');
                console.log('quizeTogo------>', Course);
            }


        }])
.factory('quizFactory', ['$firebaseArray', '$rootScope', function ($firebaseArray, $rootScope) {
    var count = 0;
    var i = 0;
    var questions = [];
    var ref1 = new Firebase('https://kiddo-56f35.firebaseio.com/quiz');
    var sync1 = $firebaseArray(ref1);
    var quiz = sync1;

    quiz.$loaded()
    .then(function () {
        angular.forEach(quiz, function (q) {
            if (q.grade == $rootScope.grade && q.subject == $rootScope.subject && q.title == $rootScope.title) {
                count = q.noOfQuestion;
                console.log('countdsddsd', count);
            }
        })

        var ref = new Firebase('https://kiddo-56f35.firebaseio.com/question');
        var sync = $firebaseArray(ref);
        var questi = sync;
        questi.$loaded()
        .then(function () {
            angular.forEach(questi, function (quest) {
                if (quest.grade == $rootScope.grade && quest.subject == $rootScope.subject && quest.title == $rootScope.title) {
                    if (i < count) {
                        questions.push(quest);
                        console.log('i value ----->', i);
                        i++;

                        console.log('questions ask should 5', questions);
                    }

                }

            })
        });
    });




    /*var ref = new Firebase('https://kiddo-56f35.firebaseio.com/question');
    var sync = $firebaseArray(ref);
    var questions = sync;
    console.log('Omali Grade-------------->', $rootScope.grade);
    console.log('Omali Subject-------------->', $rootScope.subject);
    console.log('Omali Title-------------->', $rootScope.title);*/

    /*var questions = [
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
    ];*/

    return {
        getQuestion: function (id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        },

        addMarks: function (mark) {
            console.log('marks----------->', mark);
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
                    scope.questiontype = q.type;
                    scope.question = q.question;
                    scope.options =[q.answer1,q.answer2,q.answer3,q.answer4];
                    scope.answer = q.canswer;
                    scope.answerMode = true;
                    console.log(q);
                } else {
                    scope.quizOver = true;
                    quizFactory.addMarks(scope.score);
                }
            };

            scope.checkAnswer = function () {
                if (!$('input[name=answer]:checked').length) return;

                var ans = $('input[name=answer]:checked').val();

                if (ans == scope.options[scope.answer-1]) {
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

            if (scope.quizOver == true) {

            }


        }
    }
});
