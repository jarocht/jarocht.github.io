var application = angular.module('application', []);

application.controller('portfolioCtrl', function ($scope, $http, $window) {
    //init vars
    $scope.index = 0;
    $scope.Selected = '';
    $scope.Records = '';


    $http.get('./content/portfolio/data.json').success(function (data) {
        $scope.Records = data;
        $scope.Selected = $scope.Records["entries"][$scope.index];
    });

    $scope.previous = function() {
        if ($scope.index > 0) {
            $scope.index = $scope.index - 1;
            $scope.Selected = $scope.Records["entries"][$scope.index];
        }
    };
    $scope.next = function() {
        if ($scope.index + 1 < $scope.Records["entries"].length) {
            $scope.index = $scope.index + 1;
            $scope.Selected = $scope.Records["entries"][$scope.index];
        }
    };
    $scope.navTo = function(index) {
        if (index > -1 && index < $scope.Records["entries"].length) {
            $scope.index = index;
            $scope.Selected = $scope.Records["entries"][$scope.index];
            $window.scrollTo(0, 0);
        }
    };
    $scope.getRecord = function(index) {
        if (index > -1 && index < $scope.Records["entries"].length) {
            return $scope.Records["entries"][index];
        }
        return null;
    };

    $scope.isImageAvailable = function() {
        return false;
    };

    $scope.getImageUrl = function () {
        if ($scope.Selected.image == null)
            return $scope.Records["defaultImage"];
        return $scope.Selected.image;
    };
});