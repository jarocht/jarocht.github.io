var application = angular.module('application', []);

application.config(function ($locationProvider) {
    console.log("DONE THIS");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

application.controller('portfolioCtrl', function ($scope, $http, $window, $location) {
    //init vars
    $scope.index = 0;
    $scope.Selected = {};
    $scope.Records = {};

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

    $scope.isImageAvailable = function() {
        return false;
    };

    $scope.getImageUrl = function () {
        if ($scope.Selected.image == null)
            return $scope.Records["defaultImage"];
        return $scope.Selected.image;
    };

    function setRecord(index, scroll) {
        if (index > -1 && index < $scope.Records["entries"].length) {
            $scope.index = index;
            $location.hash(index);
            $scope.Selected = $scope.Records["entries"][$scope.index];
            if (scroll) {
                $window.scrollTo(0, 0);
            }
        }
    };
});