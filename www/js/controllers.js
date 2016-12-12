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

.controller('DashCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$ionicHistory', '$rootScope',
        function ($scope, $state, $stateParams, $firebaseArray,$ionicHistory, $rootScope) {
            screen.lockOrientation('landscape');
            var ref = new Firebase('https://kiddo-56f35.firebaseio.com/course').limitToLast(5);
            var sync = $firebaseArray(ref);
            $scope.courses = sync;

        }])

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
                    img: firebase.auth().currentUser.photoURL
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
                    img: firebase.auth().currentUser.photoURL,
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

.controller('AccountCtrl',function ($scope,$rootScope, $state,$firebaseArray, $ionicSideMenuDelegate) {

  var ref=new Firebase('https://kiddo-56f35.firebaseio.com/child');
  var sync = $firebaseArray(ref);

  var refp = new Firebase('https://kiddo-56f35.firebaseio.com/progress');
  var syncp = $firebaseArray(refp);

  $scope.allprogress = syncp;
  $scope.children=sync;
  $scope.userId=firebase.auth().currentUser.uid;
  $scope.childNames = [];
  $scope.progress = [];

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

  $scope.showSelectChild = function (selectchild) {
      console.log('hiiiii child1', selectchild);
      angular.forEach($scope.children, function (c) {
          if (c.parent == $scope.userId) {
              if (c.name == selectchild) {
                  $rootScope.child = c;
                  var i;
                  for (i = 0; i < syncp.length; i++) {
                      if (syncp[i].childname == selectchild && syncp[i].parentid == $scope.userId) {
                          $scope.progress.push(syncp[i]);
                      }
                  }
                  console.log('rooot child', c);
              }
          }
      })

  }

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
        //$rootScope.child = $scope.child.child;
        console.log('hiii child', $scope.child.name);
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

            $scope.currentUser1 = null;

            $scope.login = function(data) {
                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var email = data.username;
                var pass = data.password;
                if (!filter.test(email)||pass==null)
                {
                    if (!filter.test(data.email)) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Invalid e-mail'
                        });//alert
                    }

                    if (pass == null) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a password'
                        });//alert
                    }
                }
                else
                {

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

                    }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Invalid Login',
                            template: errorMessage
                        });//alert

                    });//catch
                }

            }//$scope.login

            $scope.register = function () {

                $state.go('register');

            };//$scope.register


            /*--------------------------------------------add child --------------------------------------------------------*/
            $scope.addChildAccount = function (data) {
                console.log('user88888888888:',firebase.auth().currentUser.uid);
                var fb = new Firebase("https://kiddo-56f35.firebaseio.com/child/");
                //  var sync = $firebaseArray(fb);
                
                console.log('name is ',name);
                console.log('grade :', grade);
                var letterNumber = /^[A-Za-z][A-Za-z0-9]*/;
                if (data.name1 == null || !letterNumber.test(data.name1) || data.grade == '0'||data.grade ==null)
                {
                    if (data.name1 == null) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a name.'
                        });//alert}
                    }
                    else if (!letterNumber.test(data.name1))
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a valid name starting with a letter'
                        });//alert}
                    }
                    else if (data.grade == '0' || data.grade == null)
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please select a grade'
                        });//alert}
                    }
                    
                }
                else {
                    var parent = firebase.auth().currentUser.uid;
                    var name = data.name1;
                    var grade = data.grade;
                var a = firebase.auth().currentUser;
            $scope.currentUser1= firebase.auth().currentUser;
            $rootScope.username=firebase.auth().currentUser.displayName;
            console.log('----------------------',$scope.currentUser1.displayName);

            fb.push({
                parent:parent,
                name:name,
                grade:grade,
                image: "data:image/png;base64,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"
            });
            $state.go('manageChild');
        }

            };//$scope.addChildAccount

            $scope.addUserEmail = function (data) {
                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var letterNumber = /^[A-Za-z][A-Za-z0-9]*/;
                if (data.username==null||!letterNumber.test(data.username) || !filter.test(data.email) || data.password == null || data.password != data.password2)
                {

                    if (!letterNumber.test(data.username) || data.username == null)
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a valid username starting with a letter'
                        });//alert
                    }

                    if (!filter.test(data.email))
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Invalid e-mail'
                        });//alert
                    }
                    if (data.password ==null) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a password'
                        });//alert
                    }
                    if (data.password != data.password2) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Password confirmation does not match'
                        });//alert
                    }
                    
                }
        else{
                var email = data.email;
                var pass = data.password;
                var pass2 = data.password2;
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
        }
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
   .controller('ChildCtrl', ['$scope', '$firebaseArray', '$ionicPopup', '$firebaseObject', '$cordovaImagePicker',
   function ($scope, $firebaseArray, $ionicPopup, $firebaseObject, $cordovaImagePicker) {

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
                      var ref = new Firebase('https://kiddo-56f35.firebaseio.com/child/' + id);
                      var letterNumber = /^[A-Za-z][A-Za-z0-9]*/;
                      if ($scope.editData.name == null || !letterNumber.test($scope.editData.name))
                      {
                          
                          $ionicPopup.alert({
                              title: 'Error',
                              template: 'Please enter a valid username'
                          });//alert

                      }
                      else{
                          ref.update({
                          name:$scope.editData.name,
                          grade:$scope.editData.grade

                          });
                         //return scope.data.response;
                      }
                  }
                },
              ]
            }).then(function(password) {
              
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

     $scope.showProfilePicturePopup = function (id) {
         var childId = id;
         console.log(id);
         var myPopup = $ionicPopup.show({
             templateUrl: 'templates/change-profile-picture-child-popup.html',
             title: 'Change my profile picture',
             scope: $scope,

             buttons: [
               { text: 'Cancel' },
             ]
         });

         $scope.doGetImage = function () {

             var options = {
                 maximumImagesCount: 1,
                 width: 800,
                 height: 800,
                 quality: 80
             };

             $cordovaImagePicker.getPictures(options)
             .then(function (results) {

                 console.log('Image URI: ' + results[0]);
                 var selectedImage = results[0];

                 $scope.save = function () {
                     console.log('save');
                     window.plugins.Base64.encodeFile(selectedImage, function (base64) {  // Encode URI to Base64 needed for contacts plugin
                         var encoded = base64;
                         var ref = new Firebase('https://kiddo-56f35.firebaseio.com/child/'+childId);
                         ref.update({
                             image: encoded
                         });
                         console.log(ref);
                         console.log(childId);
                         myPopup.close();
                        
                     });
                 };

             }, function (error) {
                 // error getting photos
             });

         };
     }
   }])
   .controller('ParentProfileCtrl', ['$scope', '$firebaseArray', '$ionicPopup', '$firebaseObject',
       '$state', '$cordovaImagePicker',
    function ($scope, $firebaseArray, $ionicPopup, $firebaseObject, $state, $cordovaImagePicker) {

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
                var letterNumber = /^[A-Za-z][A-Za-z0-9]*/;
                if (!letterNumber.test(username)||username==null)
                {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Please enter a valid username'
                    });//alert
                }
                else{
                    user.updateProfile({
                        displayName:username
                    }).then(function() {
                        $scope.name=firebase.auth().currentUser.displayName;
                        myPopup.close();
                        $state.go('parentProfile');
                    }, function(error) {
                        console.log(error);
                    });
                }
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

          $scope.changeUserPassword = function(data){
            var user = firebase.auth().currentUser;
            var email = firebase.auth().currentUser.email;
            var oldPw = data.oldPwrd;
            var newPw = data.newPwrd;
            var confPw = data.confirmNewPwrd;
            var credential = firebase.auth.EmailAuthProvider.credential(
                email,
                oldPw
            );

            user.reauthenticate(credential).then(function() {
                if(newPw==null||newPw!=confPw)
                {
                    if(newPw==null)
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please enter a password'
                        });//alert
                    }

                    if(newPw!=confPw)
                    {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Password confirmation does not match'
                        });//alert
                    }

                }
            else
                {
                user.updatePassword(newPw).then(function() {
                    var alertPopup = $ionicPopup.alert({
                        template: 'Password changed successfully!'
                    });

                    myPopup.close();

                    $state.go('parentProfile');

                }, function(error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Password change failed!'
                    });
                });
            }

            }, function(error) {
              var alertPopup = $ionicPopup.alert({
                  title: 'Re-authentication failed!',
                  template: error.message
              });
              console.log(error.message);
              myPopup.close();
            });
          };

        };

        $scope.loadChangeProfile = function () {
           
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/change-profile-picture-parent-popup.html',
                title: 'Change my profile picture',
                scope: $scope,

                buttons: [
                  { text: 'Cancel' },
                ]
            });
            $scope.doGetImage = function () {

                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };

                $cordovaImagePicker.getPictures(options)
                .then(function (results) {

                    console.log('Image URI: ' + results[0]);
                    var selectedImage = results[0];
                    
                    $scope.save = function () {
                        window.plugins.Base64.encodeFile(selectedImage, function (base64) {  // Encode URI to Base64 needed for contacts plugin
                            var encoded = base64;

                            var user = firebase.auth().currentUser;

                            user.updateProfile({
                                photoURL: encoded
                            }).then(function () {
                                $scope.profileImage = firebase.auth().currentUser.photoURL;
                                $state.go('parentProfile');
                                myPopup.close();

                            }, function (error) {
                                console.log(error);
                            });
                        });
                    };

                }, function (error) {
                    // error getting photos
                });

            };

        };

        

        
   }])
   .controller('PasswordCtrl',['$scope', '$state', '$stateParams', '$firebaseArray','$ionicPopup', '$rootScope',
    function($scope, $state, $stateParams, $firebaseArray,$ionicPopup, $rootScope){

      $scope.forgotPassword = function(){
        var myPopup = $ionicPopup.show({
             templateUrl: 'templates/password-reset-popup.html',
             title: 'Forgot my password',
             subTitle: 'Enter your e-mail address.',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },

             ]
         });

         $scope.sendPasswordResetLink=function(data){
           var auth = firebase.auth();
           var emailAddress = data.email;

           auth.sendPasswordResetEmail(emailAddress).then(function() {
              console.log('okay');
              myPopup.close();
          }, function(error) {
              console.log(error);
          });
         };
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

    var refmark = new Firebase('https://kiddo-56f35.firebaseio.com/progress');
    var syncmark = $firebaseArray(refmark);
    var date = new Date();
   // date = $moment().format('MM/DD/YYYY');
    console.log('date---->', date);


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
            console.log('child name -------->', $rootScope.child);
            syncmark.$add({
                parentid: $rootScope.child.parent,
                childname: $rootScope.child.name,
                grade: $rootScope.grade,
                subject: $rootScope.subject,
                title: $rootScope.title,
                date: date.toString(),
                mark: mark
            });

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

        }
    }
});
