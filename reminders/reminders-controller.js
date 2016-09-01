'use strict';

angular.module('Notabene.controllers').controller('RemindersCtrl', function($scope, $firebase, $cordovaLocalNotification, FIREBASE_ROOT, Auth) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var userRef = new Firebase(FIREBASE_ROOT + loggedUser.uid);
			var reminders = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/reminders');
			var notificationsArray = JSON.parse(localStorage.getItem('NOTABENE_notifications_array_private'));

			reminders.on('value', function(snapshot) {
				if ( snapshot.val() !== null ) {
					$scope.reminders = snapshot.val();

					if ( $scope.reminders !== false ) {
						for ( var name in snapshot.val() ) {
							$scope.reminders[name].reminderId = name;
						};
					};
				} else {
					$firebase(userRef).$update({
						reminders: false
					});
				};
			});
			
			$scope.deleteReminder = function(reminder) {
				var reminderRef = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/reminders/' + reminder.reminderId);

				$cordovaLocalNotification.cancel(reminder.notificationID);
				
				$firebase(reminderRef).$remove();
			};
		});
	};
});
