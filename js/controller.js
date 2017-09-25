angular.module('RouteControllers', [])
	.controller('HomeController', function($scope) {
		$scope.title = "Welcome To Angular Todo!"
	})
	.controller('RegisterController', function($scope, $location, UserAPIService, store) {

		if (store.get('authToken')) {
        $location.path("/todo");
    	}

		$scope.registrationUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.login = function() {
            UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
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

                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    alert("You have successfully registered to Angular Todo");
                    if ($scope.data.username == $scope.registrationUser.username 
						&& $scope.data.password == $scope.registrationUser.password) {
						
						$scope.login();
					}
                }).catch(function(err) {
                    console.log(err);
                    alert("Registration failed, please try again with another username.");
                });
            }
        };
    })
	.controller('LoginController', function($scope, $location, UserService, store) {

		if (store.get('authToken')) {
        $location.path("/todo");
    	}

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

        if (!store.get('authToken')) {
        $location.path("/accounts/register");
    	}
        
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');

        $scope.todos = [];

        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
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
                $scope.todos.push($scope.todo);

                console.log($scope.todo.username)

                TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
                    console.log(results);
                }).catch(function(err) {
                    console.log(err)
                });
            }
        }

        $scope.todo = {};

        $scope.editTodo = function(id) {
            $location.path("/todo/edit/" + id);
        };

        $scope.deleteTodo = function(id) {
            TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
                console.log(results);
            }).catch(function(err) {
                console.log(err);
            });
        };
    })
    .controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
        var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
            	$scope.todo.title = $scope.todo.title;
				$scope.todo.description = $scope.todo.description;
				$scope.todo.status = $scope.todo.status;
                $scope.todo.username = $scope.username;

                console.log($scope.todo.username)

				console.log(url + "todo/" + id);

                TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, $scope.authToken).then(function(results) {
                    $location.path("/todo");
                    console.log(results)
                }).catch(function(err) {
                    console.log(err);
                })
            }
        }
    });