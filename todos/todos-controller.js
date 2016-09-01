'use strict';

angular.module('Notabene.controllers').controller('TodosCtrl', function($scope, $firebase, FIREBASE_ROOT, Auth) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var userRef = new Firebase(FIREBASE_ROOT + loggedUser.uid);
			var todos = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/todos');

			todos.on('value', function(snapshot) {
				if ( snapshot.val() !== null ) {
					$scope.todos = snapshot.val();

					if ( $scope.todos !== false ) {
						for ( var name in snapshot.val() ) {
							$scope.todos[name].todoId = name;
						};
					};
				} else {
					$firebase(userRef).$update({
						todos: false
					});
				};
			});
			
			$scope.deleteTodo = function(todo) {
				var todoRef = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/todos/' + todo.todoId);

				$firebase(todoRef).$remove();
			};
		});
	};
});
