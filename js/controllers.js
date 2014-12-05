var app = angular.module('app', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('portfolioCtrl', function ($scope, $http, $window, $location) {
    //init vars
    $scope.index = 0;
    $scope.Selected = {};
    $scope.Records = {};
    $scope.ShowImgLeftNavArrow = false;
    $scope.ShowImgRightNavArrow = false;

    $http.get('./content/portfolio/data.json').success(function (data) {
        $scope.Records = data;
        $scope.Selected = $scope.Records["entries"][$scope.index];
        if ($location.hash()) {
            setRecord($location.hash());
        }
    });


    $scope.previous = function () {
        setRecord($scope.index - 1, false);
    };
    $scope.next = function() {
        setRecord($scope.index + 1, false);
    };
    $scope.navTo = function(index) {
        setRecord(index, true);
    };
    $scope.getRecord = function(index) {
        if (index > -1 && index < $scope.Records["entries"].length) {
            return $scope.Records["entries"][index];
        }
        return null;
    };

    $scope.ShowImgNavArrows = function(bool) {
        if (!bool) {
            $scope.ShowImgLeftNavArrow = bool;
            $scope.ShowImgRightNavArrow = bool;
        }
        if ($scope.index > 0)
            $scope.ShowImgLeftNavArrow = bool;
        if ($scope.index < $scope.Records["entries"].length - 1)
            $scope.ShowImgRightNavArrow = bool;
    };

    $scope.getImageUrl = function () {
        if ($scope.Selected.image == null)
            return $scope.Records["defaultImage"];
        return $scope.Selected.image;
    };

    function setRecord(index, scroll) {
        index = parseInt(index);
        if (index > -1 && index < $scope.Records["entries"].length) {
            $scope.index = index;
            $location.hash(index);
            $scope.Selected = $scope.Records["entries"][$scope.index];
            if (scroll) {
                $window.scrollTo(0, 0);
            }
            $scope.ShowImgLeftNavArrow = ($scope.index > 0);
            $scope.ShowImgRightNavArrow = ($scope.index < $scope.Records["entries"].length - 1);
        }
    };
});