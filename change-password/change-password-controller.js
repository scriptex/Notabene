'use strict';

angular.module('Notabene.controllers').controller('ChangePasswordCtrl', function($scope, $state, $ionicLoading, Auth, User, $timeout) {
	var passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

	$scope.user = {
		oldPassword: '',
		newPassword: ''
	};

	$scope.passwordValid = true;
	$scope.errorMessage = null;

	$scope.isFirstPasswordChange = !User.hasChangedPassword();

	$scope.done = function() {
		$scope.passwordValid = passwordStrengthRegex.test($scope.user.newPassword);

		if ( !$scope.passwordValid ) {
			return;
		};

		$scope.errorMessage = null;

		$ionicLoading.show({
			template: 'Please wait...'
		});

		Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
			.then(User.recordPasswordChange)
			.then(goToDashboard)
			.catch(handleError);

		$scope.isFirstPasswordChange = false;

		$scope.user = {
			oldPassword: '',
			newPassword: ''
		};
	};

	$scope.changeState = function(state) {
		$ionicLoading.hide();

		$timeout(function() {
			$state.go(state);
		});
	};

	function goToDashboard() {
		$ionicLoading.hide();
		
		$timeout(function() {
			$state.go('app.dashboard');
		});
	};

	function handleError(error) {
		switch ( error.code ) {
			case 'INVALID_PASSWORD':
				$scope.errorMessage = 'Invalid password';
				break;
			default:
				$scope.errorMessage = 'Error: [' + error.code + ']';
		};

		$ionicLoading.hide();
	};
});
