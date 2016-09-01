'use strict';

angular.module('Notabene', ['ionic', 'firebase', 'ui.tinymce', 'angularMoment', 'btford.markdown', 'Notabene.services', 'Notabene.controllers', 'ngCordova'])
	.filter('currentYear',['$filter', function($filter) {
	    return function() {
	        return $filter('date')(new Date(), 'yyyy');
	    };
	}])

	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
		var auth = function($q, $timeout, Auth, User) {
			var defer = $q.defer();
			var state = this;

			Auth.getCurrentUser().then(function() {
				User.loadCurrentUser().then(function() {
					if ( state.name === 'change-password' ) {
						defer.resolve();
					} else {
						if ( User.hasChangedPassword() ) {
							defer.resolve();
						} else {
							defer.reject('change-password');
						};
					};
				});
			}, function() {
				$timeout(function() {
					defer.reject('login');
				}, 250);
			});

			return defer.promise;
		};

		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'sidemenu/sidemenu.html',
				controller: 'SideMenuCtrl'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'signup/signup.html',
				controller: 'SignupCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'login/login.html',
				controller: 'LoginCtrl'
			})
			.state('reset-password', {
				url: '/reset-password',
				templateUrl: 'reset-password/reset-password.html',
				controller: 'ResetPasswordCtrl'
			})
			.state('change-password', {
				url: '/change-password',
				templateUrl: 'change-password/change-password.html',
				controller: 'ChangePasswordCtrl',
				resolve: {
					auth: auth
				}
			})
			.state('app.dashboard', {
				url: '/dashboard', 
				views: {
					menuContent: {
						templateUrl: 'dashboard/dashboard.html',
						controller: 'DashboardCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.notes', {
				url: '/notes', 
				views: {
					menuContent: {
						templateUrl: 'notes/notes.html',
						controller: 'NotesCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.note', {
				url: '/notes/:noteId',
				views: {
					menuContent: {
						templateUrl: 'single-note/single-note.html',
						controller: 'SingleNoteCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.create-note', {
				url: '/create-note',
				views: {
					menuContent: {
						templateUrl: 'create-note/create-note.html',
						controller: 'CreateNoteCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.reminders', {
				url: '/reminders', 
				views: {
					menuContent: {
						templateUrl: 'reminders/reminders.html',
						controller: 'RemindersCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.reminder', {
				url: '/reminders/:reminderId', 
				views: {
					menuContent: {
						templateUrl: 'single-reminder/single-reminder.html',
						controller: 'SingleReminderCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.create-reminder', {
				url: '/create-reminder',
				views: {
					menuContent: {
						templateUrl: 'create-reminder/create-reminder.html',
						controller: 'CreateReminderCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.todos', {
				url: '/todos', 
				views: {
					menuContent: {
						templateUrl: 'todos/todos.html',
						controller: 'TodosCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.todo', {
				url: '/todos/:todoId', 
				views: {
					menuContent: {
						templateUrl: 'single-todo/single-todo.html',
						controller: 'SingleTodoCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.create-todo', {
				url: '/create-todo',
				views: {
					menuContent: {
						templateUrl: 'create-todo/create-todo.html',
						controller: 'CreateTodoCtrl',
						resolve: {
							auth: auth
						}
					}
				}
			})
			.state('app.error', {
				url: '/error',
				views: {
					menuContent: {
						templateUrl: 'error/error.html'
					}
				}
			})
			.state('app.about', {
				url: '/about',
				views: {
					menuContent: {
						templateUrl: 'about/about.html'
					}
				}
			})
			.state('app.markdown', {
				url: '/markdown',
				views: {
					menuContent: {
						templateUrl: 'about/markdown.html'
					}
				}
			});

		$urlRouterProvider.otherwise('/app/dashboard');

		$ionicConfigProvider.views.transition('ios');
		$ionicConfigProvider.navBar.alignTitle('center');
	})

	.run(function($rootScope, $state, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			if ( window.cordova ) {
				if ( window.cordova.plugins.Keyboard ) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				};

				if ( device.platform === 'iOS' ) {
					window.plugin.notification.local.promptForPermission();
				};
			};

			if ( window.StatusBar ) {
				StatusBar.styleDefault();
			};

			$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
				$state.go(error);
			});

			if ( !localStorage.getItem('NOTABENE_notifications_array_private') ) {
				localStorage.setItem('NOTABENE_notifications_array_private', '[]');
			};
		});
	})
	
	.constant('FIREBASE_ROOT', 'https://notabene.firebaseio.com/');

angular.module('Notabene.services', []);
angular.module('Notabene.directives', []);
angular.module('Notabene.controllers', []);
