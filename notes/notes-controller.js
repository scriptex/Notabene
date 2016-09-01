'use strict';

angular.module('Notabene.controllers').controller('NotesCtrl', function($scope, $firebase, FIREBASE_ROOT, Auth) {
	if ( Auth.getCurrentUser() ) {
		Auth.getCurrentUser().then(function(loggedUser) {
			var userRef = new Firebase(FIREBASE_ROOT + loggedUser.uid);
			var notes = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/notes');

			notes.on('value', function(snapshot) {
				if ( snapshot.val() !== null ) {
					$scope.notes = snapshot.val();

					if ( $scope.notes !== false ) {
						for ( var name in snapshot.val() ) {
							$scope.notes[name].noteId = name;
						};
					};
				} else {
					$firebase(userRef).$update({
						notes: false
					});
				};
			});
			
			$scope.deleteNote = function(note) {
				var noteRef = new Firebase(FIREBASE_ROOT + loggedUser.uid + '/notes/' + note.noteId);

				$firebase(noteRef).$remove();
			};
		});
	};
});