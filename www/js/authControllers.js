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


  .controller('LoginCtrl', function ($scope, $ionicPopup, $state, Child,User) {

            $scope.user=User;
            $scope.child = Child;

    $scope.login = function(data) {

        var username=data.username;
        console.log("888888888888888888888888888888888888888888888888888888888888");
        console.log(username);

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

      console.log(data);
      var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Child Account Successfully Created!'
      });
      $state.go('tab.dash');
    };

    $scope.addUserEmail = function (data) {

        var email = data.email;
        var pass = data.password;

          console.log("Email:", email);
            console.log("pass:", pass);

        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
			});
		};
	});
