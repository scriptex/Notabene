'use strict';

angular.module('Notabene.controllers').controller('SingleReminderCtrl', function($rootScope, $scope, $stateParams, $cordovaLocalNotification, $firebase, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var reminder = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/reminders/' + $stateParams.reminderId);
			var notificationsArray = JSON.parse(localStorage.getItem('NOTABENE_notifications_array_private'));
			var notificationID;

			reminder.on('value', function(snapshot) {
				$scope.currentReminder = snapshot.val();

				$scope.currentReminder.date = new Date(snapshot.val().date);
				$scope.currentReminder.time = new Date(snapshot.val().time);

				notificationID = snapshot.val().notificationID;
			});
			
			$scope.updateReminder = function(currentReminder) {
				var notificationDateTime;

				$firebase(reminder).$update({
					content: currentReminder.content,
					date: currentReminder.date,
					editMode: false,
					repeating: currentReminder.repeating,
					repetition: currentReminder.repetition,
					time: currentReminder.time,
					title: currentReminder.title,
					notification: currentReminder.notification,
					created: moment(new Date()).format('MM/DD/YYYY H:mm:ss A')
				});

				notificationDateTime = new Date(moment(new Date(currentReminder.date)).format('MM/DD/YYYY') + ' ' + moment(new Date(currentReminder.time)).format('H:mm:ss'));

				if ( typeof cordova !== 'undefined' ) {
					if ( currentReminder.notification ) {
						$cordovaLocalNotification.isPresent(notificationID).then(function(present) {
							if ( present ) {
								$cordovaLocalNotification.update({
									id: notificationID,
									date: notificationDateTime,
									every: currentReminder.repetition,
									text: currentReminder.title,
									title: 'Notabene Reminder'
								});
							} else {
								$cordovaLocalNotification.schedule({
									id: notificationID,
									date: notificationDateTime,
									every: currentReminder.repetition,
									text: currentReminder.title,
									title: 'Notabene Reminder'
								});
							};
						});
					} else {
						$cordovaLocalNotification.cancel(notificationID);
					};
				};
			};

			$scope.turnEditModeOn = function(currentReminder) {
				currentReminder.editMode = true;
			};
		});
	};
});
