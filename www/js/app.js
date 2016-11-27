// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.controller('starterCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$ionicHistory', '$rootScope', '$ionicSideMenuDelegate',
function ($scope, $state, $stateParams, $firebaseArray, $ionicHistory, $rootScope, $ionicSideMenuDelegate) {
    $scope.onclick = function () {
        console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe");
    }
    $scope.parentProfile = function () {
        console.log("---->parentProfile");
        $state.go('parentProfile');
    }
    $scope.registerChild = function () {
        console.log("---->registerChild");
        $state.go('registerChild');
    }
    $scope.manageChild = function () {
        console.log("---->manageChild");
        $state.go('manageChild');
    }

}])

.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

   // setup an abstract state for the tabs directive
    .state('login', {
        url: '/login',
        templateUrl: 'Login/login.html',
        controller: 'LoginCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
      url: '/dash',
      views: {
          'tab-dash': {
              templateUrl: 'templates/tab-dash.html',
              controller: 'DashCtrl'
          }
      }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
          'tab-chats': {
              templateUrl: 'templates/tab-chats.html',
              controller: 'ChatsCtrl'
          }
      }
  })
    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    })

  .state('tab.account', {
      url: '/account',
      views: {
          'tab-account': {
              templateUrl: 'templates/tab-account.html',
              controller: 'AccountCtrl'
          }
      }
  })
  .state('register', {
      url: '/register',
      templateUrl: 'Login/register.html',
      controller: 'LoginCtrl'
  })

  .state('registerChild', {
      url: '/registerChild',
      templateUrl: 'Login/registerChild.html',
      controller: 'LoginCtrl'
  })
   .state('manageChild', {
       url: '/manageChild',
       templateUrl: 'Login/manageChild.html',
       controller: 'ChildCtrl'
   })
    .state('editProfile', {
        url: '/editProfile',
        templateUrl: 'templates/edit-profile-popup.html',
        controller: 'ChildCtrl'
    })

   .state('editParentUserName', {
         url: '/editParentUserName',
         templateUrl: 'templates/paren-username-popup.html',
         controller: 'ParentProfileCtrl'
      })

  .state('virtualcls', {
      cache: false,
      url: '/virtualcls',
      templateUrl: 'Classroom/classroom.html',
      controller: 'VirtualclsCtrl'
  })
   .state('viewChat', {
       url: '/viewChat',
       templateUrl: 'templates/viewChat.html',
       controller: 'ChatsCtrl'

   })
   .state('storybook', {
       cache: false,
       url: '/storybook',
       templateUrl: 'templates/storybook.html',
       controller: 'storybookCtrl'

   })
   .state('parentProfile', {

       url: '/parentProfile',
       templateUrl: 'templates/parentProfile.html',
       controller: 'ParentProfileCtrl'

   })
    .state('grade', {
        cache: false,
        url: '/grade',
        templateUrl: 'Classroom/grade.html',
        controller: 'VirtualclsCtrl'

    })

    .state('course', {
        cache: false,
        url: '/course',
        templateUrl: 'Classroom/course.html',
        controller: 'courseCtrl',
        params: {
            pcourse: null
        }

    })
    .state('subject', {
        url: '/course/:grade',
        templateUrl: 'Classroom/subject.html',
        controller: 'classroomCtrl'

    })
     .state('title', {
         cache: false,
         url: '/course/:grade/:sub',
         templateUrl: 'Classroom/title.html',
         controller: 'classroomCtrl'

     })
   .state('storybookcontent', {
       cache: false,
       url: '/storybook/selectedBook',
       templateUrl: 'templates/storybookcontent.html',
       controller: 'storybookcontentCtrl',
       params: {
           obj: null
       }
   })
    .state('storybookreader', {
        cache: false,
        url: '/storybookreader',
        cache: false,
        templateUrl: 'templates/storybookreader.html',
        controller: 'storybookreaderCtrl',
        params: {
            book: null
        }

    })
    .state('storybookautoreader', {
        cache: false,
        url: '/storybookautoreader',
        cache: false,
        templateUrl: 'templates/storybookautoreader.html',
        controller: 'storybookreaderCtrl',
        params: {
            book: null
        }

    })
    .state('account', {
        url: '/account',
        templateUrl: 'templates/tab-account.html',
        controller: 'accountCtrl'
    })

    .state('quiz', {
        url: '/quiz',
        templateUrl: 'templates/quiz.html',
        directive: 'quiz',
    })
    .state('achievement', {
        url: '/achievement',
        templateUrl: 'templates/achievement.html',
        //controller: 'achievement',
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
