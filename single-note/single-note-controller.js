'use strict';

angular.module('Notabene.controllers').controller('SingleNoteCtrl', function($scope, $stateParams, $firebase, FIREBASE_ROOT, Auth, moment) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var note = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/notes/' + $stateParams.noteId);

			note.on('value', function(snapshot) {
				$scope.currentNote = snapshot.val();
			});
			
			$scope.updateNote = function(currentNote) {
				$firebase(note).$update({
					title: currentNote.title,
					content: currentNote.content,
					date: moment(new Date()).format('MM/DD/YYYY H:mm:ss A'),
					editMode: false
				});

				currentNote.editMode = false;
			};

			$scope.turnEditModeOn = function(currentNote) {
				currentNote.editMode = true;
			};
		});
	};
});
