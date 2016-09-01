'use strict';

angular.module('Notabene.controllers').controller('CreateTodoCtrl', function($scope, $state, $filter, $ionicPopup, $firebase, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			$scope.list = [];
			$scope.newEntry = {
				text: ''
			};

			var todos = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/todos');

			$scope.createTodo = function(todo) {
				if ( $scope.list.length ) {
					$firebase(todos).$add({
						title: todo.title,
						content: $scope.list,
						editMode: false,
						date: moment(new Date()).format('MM/DD/YYYY H:mm:ss A')
					});

					todo.title = '';
					todo.content = ''; 

					$scope.list = [];
					$scope.newEntry.text = '';

					$state.go('app.todos');
				};
			};

			$scope.createTodoItem = function(event) {
				if ( event.keyCode === 13 ) {
					event.preventDefault();

					if ( !$filter('filter')($scope.list, { text: $scope.newEntry.text }).length ) {
						$scope.list.push({
							text: $scope.newEntry.text,
							isChecked: false
						});
						
						$scope.newEntry.text = '';
					} else {
						event.target.blur();

						$ionicPopup.alert({
							title: 'Error!',
							template: 'You have already added this entry.'
						}).then(function() {
							event.target.focus();
						});
					};
				};
			};

			$scope.deleteEntry = function(index) {
				$scope.list.splice(index, 1);
			};
		});
	};
});
