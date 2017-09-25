angular.module('RouteControllers', [])
	.controller('HomeController', function($scope) {
		$scope.title = "Welcome To Angular Todo!";
	})
	.controller('RegisterController', function($scope, $location, UserAPIService, store) {

		$scope.registrationUser = {};
		var url = "https://morning-castle-91468.herokuapp.com/";

		$scope.login = function() {
			UserAPIService.callAPI(url + "accounts/api-token-auth/", $scope.data).then(function(results){
				$scope.token = results.data.token;
				store.set('username', $scope.registrationUser.username);
				store.set('authToken', $scope.token);
				$location.path("/todo");
			}).catch(function(err) {
				console.log(err.data);
			});
		}

		$scope.submitForm = function() {
			if ($scope.registrationForm.$valid) {
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;

				UserAPIService.callAPI(url + "accounts/register/", $scope.registrationUser).then(function(results) {
					$scope.data = results.data;
					if ($scope.data.username == $scope.registrationUser.username 
						&& $scope.data.password == $scope.registrationUser.password) {
						
						$scope.login();
					}
				}).catch(function(err) {
					console.log(err)
				});
			}
		}
	})
	.controller('LoginController', function($scope, $location, UserService, store) {
		var url = "https://morning-castle-91468.herokuapp.com/";

		$scope.submitForm = function() {
			if ($scope.loginForm.$valid) {
				$scope.loginUser.username = $scope.user.username;
				$scope.loginUser.password = $scope.user.password;

				UserAPIService.callAPI(url + "accounts/api-token-auth", $scope.loginUser).then(function(results) {
					$scope.token = results.data.token;
					store.set('username', $scope.loginUser.username);
					store.set('authToken', $scope.token);
					$location.path("/todo");
				}).catch(function(err) {
					console.log(err);
				});
			}
		};
	})
	.controller('LogoutController', function(store) {
		store.remove('username');
		store.remove('authToken');
	})
	.controller('TodoController', function($scope, $location, TodoAPIService, store) {
		var url = "https://morning-castle-91468.herokuapp.com/";

		$scope.authToken = store.get('authToken');
		$scope.username = store.get('username');

		$scope.todo = {};

		$scope.editTodo = function(id) {
			$location.path("/todo/edit/" + id);
		};

		$scope.deleteTodo = function(id) {
			TodoAPIService.deleteTodo(url + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
				console.log(results);
			}).catch(function(err) {
				console.log(err);
			});
		};

		if (!store.get('authToken')) {
			$location.path("/");
		}

		TodoAPIService.getTodos(url + "todo/", $scope.username, $scope.authToken).then(function(results) {
			$scope.todos = results.data;
			console.log($scope.todos);
		}).catch(function(err) {
			console.log(err);
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.title = $scope.todo.title;
				$scope.todo.description = $scope.todo.description;
				$scope.todo.status = $scope.todo.status;
				$scope.todo.username = $scope.username;

				console.log($scope.todo.username)

				TodoAPIService.createTodo(url + "todo/", $scope.todo, $scope.authToken).then(function(results) {
					console.log(results)
				}).catch(function(err) {
					console.log(err)
				})
			}
		}
	})
	.controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
		var id = $routeParams.id;
		var url = "https://morning-castle-91468.herokuapp.com/";

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.title = $scope.todo.title;
				$scope.todo.description = $scope.todo.description;
				$scope.todo.status = $scope.todo.status;
				$scope.todo.username = $scope.username;

				console.log($scope.todo.username)

				console.log(url + "todo/" + id);

				TodoAPIService.editTodo(url + "todo/" + id, $scope.todo, $scope.authToken).then(function(results) {
					console.log(results)
				}).catch(function(err) {
					console.log(err)
				})
			}
		}
	});
