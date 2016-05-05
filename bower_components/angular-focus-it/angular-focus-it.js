angular.module('focusIt', [])
	.factory('focus', ['$timeout', function($timeout){
		return function(id, timeout) {
			$timeout(function() {
				var element = document.getElementById(id);
				if(element) element.focus();
			}, timeout || 0);
		};
	}])
	.directive('focusOn', ['focus', function(focus) {
		return function($scope, $elem, $attrs) {
			$elem.on($attrs.focusOn, function() {
				focus($attrs.focusId, $attrs.focusTimeout);
			});

			$scope.$on('$destroy', function() {
				$elem.off($attrs.focusOn);
			});
		};
	}]);
