'use strict';

angular.module('Notabene.controllers').controller('CreateNoteCtrl', function($scope, $state, $firebase, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var notes = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/notes');

			$scope.createNote = function(note) {
				$firebase(notes).$add({
					title: note.title,
					content: note.content,
					date: moment(new Date()).format('MM/DD/YYYY H:mm:ss A'),
					editMode: false
				});

				note.title = '';
				note.content = '';

				$state.go('app.notes');
			};
		});
	};
});
