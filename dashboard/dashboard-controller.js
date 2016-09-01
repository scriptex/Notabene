'use strict';

angular.module('Notabene.controllers').controller('DashboardCtrl', function($scope, $timeout, $firebase, Auth, FIREBASE_ROOT) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var userRef = new Firebase(FIREBASE_ROOT + loggedUser.uid);

			$scope.tinymceOptions = {
				selector: 'textarea',
				theme: 'modern',
				menubar: false,
				plugins: ['lists link image print media paste'],
				toolbar: 'newdocument print | undo redo | cut copy paste | alignleft aligncenter alignright alignjustify | link image media | styleselect | fontsizeselect | bold italic underline strikethrough | bullist numlist'
			};	

			userRef.on('value', function(snapshot) {
				var userData = snapshot.val();

				if ( userData === null ) {
					$firebase(userRef).$set({ 
						notes: false,
						reminders: false,
						todos: false
					});

					$timeout(function() {
						$scope.allNotes = 0;
						$scope.allReminders = 0;
						$scope.allTodos = 0;
					});
				} else {
					$timeout(function() {
						if ( !userData.notes ) {
							$scope.allNotes = 0;
						} else {
							$scope.allNotes = Object.keys(userData.notes).length;
						};

						if ( !userData.reminders ) {
							$scope.allReminders = 0;
						} else {
							$scope.allReminders = Object.keys(userData.reminders).length;
						};

						if ( !userData.todos ) {
							$scope.allTodos = 0;
						} else {
							$scope.allTodos = Object.keys(userData.todos).length;
						};
					});
				};
			});
		});
	};
});
