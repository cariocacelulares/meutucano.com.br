angular.module('app', [
	'focusIt'
])
.controller('HomeCtrl', ['$scope', 'focus', function($scope, focus) {

	focus('name');

	$scope.focusName = function()
	{
		focus('name');
	};

}]);