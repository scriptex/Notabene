'use strict';

angular.module('Notabene.controllers').controller('LoginCtrl', function($scope, $state, $ionicLoading, Auth, User, $timeout) {
	$scope.user = {
		email: '',
		password: ''
	};
	
	$scope.errorMessage = null;

	$scope.login = function() {
		$scope.errorMessage = null;

		$ionicLoading.show({
			template: 'Please wait...'
		});

		Auth.login($scope.user.email, $scope.user.password)
			.then(User.loadCurrentUser)
			.then(redirectBasedOnStatus)
			.catch(handleError);
	};

	function redirectBasedOnStatus() {
		$timeout(function() {
			if ( User.hasChangedPassword() ) {
				$state.go('app.dashboard');
			} else {
				$state.go('change-password');
			};
		});

		$ionicLoading.hide();
	};

	function handleError(error) {
		switch (error.code) {
			case 'INVALID_EMAIL':
			case 'INVALID_PASSWORD':
			case 'INVALID_USER':
				$scope.errorMessage = 'Email or password is incorrect';
				break;
			default:
				$scope.errorMessage = 'Error: [' + error.code + ']';
		};

		$ionicLoading.hide();
	};
});
