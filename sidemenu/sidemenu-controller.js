'use strict';

angular.module('Notabene.controllers').controller('SideMenuCtrl', function($scope, $state, Auth) {
	$scope.logout = function() {
		Auth.logout();
		
		$state.go('login');
	};
});
