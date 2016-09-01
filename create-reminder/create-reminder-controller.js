'use strict';

angular.module('Notabene.controllers').controller('CreateReminderCtrl', function($rootScope, $scope, $state, $cordovaLocalNotification, $firebase, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var reminders = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/reminders');
			
			$scope.createReminder = function(reminder) {
				var notificationsArray = JSON.parse(localStorage.getItem('NOTABENE_notifications_array_private'));
				var notificationID = notificationsArray.length + 1;
				var notificationDateTime;
				
				notificationsArray.push(notificationID);

				localStorage.setItem('NOTABENE_notifications_array_private', JSON.stringify(notificationsArray));

				$firebase(reminders).$add({
					content: reminder.content,
					date: reminder.date,
					editMode: false,
					repeating: reminder.repeating,
					repetition: reminder.repetition,
					time: reminder.time,
					title: reminder.title,
					notification: reminder.notification,
					created: moment(new Date()).format('MM/DD/YYYY H:mm:ss A'),
					notificationID: notificationID
				});

				notificationDateTime = new Date(moment(new Date(reminder.date)).format('MM/DD/YYYY') + ' ' + moment(new Date(reminder.time)).format('H:mm:ss'));

				if ( reminder.notification && typeof cordova !== 'undefined' ) {
					$cordovaLocalNotification.schedule({
						id: notificationID,
						date: notificationDateTime,
						every: reminder.repetition,
						text: reminder.title,
						title: 'Notabene Reminder'
					});
				};

				reminder.title = '';
				reminder.content = '';
				reminder.date = '';
				reminder.time = '';
				reminder.notification = true;
				reminder.repeating = false;
				reminder.repetition = 0;

				$state.go('app.reminders');
			};
		});
	};
});
