'use strict';

angular.module('Notabene.controllers').controller('SingleTodoCtrl', function($scope, $filter, $stateParams, $firebase, $ionicPopup, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			$scope.list = [];
			$scope.newEntry = {
				text: ''
			};

			var todo = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/todos/' + $stateParams.todoId);

			todo.on('value', function(snapshot) {
				$scope.currentTodo = snapshot.val();
				
				if ( snapshot.val() !== null ) {
					$scope.list = snapshot.val().content;
				};
			});
			
			$scope.updateTodo = function(currentTodo) {
				$firebase(todo).$update({
					title: currentTodo.title,
					content: $scope.list,
					editMode: false,
					date: moment(new Date()).format('MM/DD/YYYY H:mm:ss A')
				});

				currentTodo.editMode = false;
			};

			$scope.turnEditModeOn = function(currentTodo) {
				currentTodo.editMode = true;
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

			$scope.updateEntry = function(index, state) {
				var todoEntry = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/todos/' + $stateParams.todoId + '/content/' + index);

				$firebase(todoEntry).$update({
					isChecked: state
				});
			};
		});
	};
});
