var application = angular.module('application', []);

application.controller('portfolioCtrl', function ($scope, $http) {
    $scope.index = 0;
    $http.get('blog/posts.json').success(function(data) {
        $scope.Records = data;
        $scope.Selected = $scope.Records["array"][$scope.index];
    });
});