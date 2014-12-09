var app = angular.module('app');

app.controller('portfolioCtrl', function ($scope, $window, $location, contentFactory) {
    //init vars
    $scope.index = 0;
    $scope.selected = {};
    var promise = contentFactory.getPortfolioData();
    promise.then(
        function(payload) {
            $scope.entries = payload.data['entries'];
            $scope.defaultImageUrl = payload.data['defaultImageUrl'];
            if (setSelected($location.hash()) == -1)
                setSelected(0);
            $scope.ShowImgLeftNavArrow = false;
            $scope.ShowImgRightNavArrow = false;
        });

    $scope.previous = function () {
        setSelected($scope.index - 1);
        updateImageArrows();
    };
    $scope.next = function () {
        setSelected($scope.index + 1);
        updateImageArrows();
    };
    $scope.navTo = function (index) {
        setSelected(index);
        scrollToTop();
    };
    $scope.getRecord = function(index) {
        if (index > -1 && index < $scope.entries.length) {
            return $scope.entries[index];
        }
        return $scope.entries[0];
    };

    $scope.ShowImgNavArrows = function (bool) {
        $scope.ShowImgLeftNavArrow = (bool && $scope.index > 0);
        $scope.ShowImgRightNavArrow = (bool && $scope.index < $scope.entries.length - 1);
    };

    $scope.getImageUrl = function () {
        if (!$scope.selected.image)
            return $scope.defaultImageUrl;
        return $scope.selected.image;
    };

    function scrollToTop() {
        $window.scrollTo(0, 0);
    }

    function updateImageArrows() {
        $scope.ShowImgLeftNavArrow = ($scope.index > 0);
        $scope.ShowImgRightNavArrow = ($scope.index < $scope.entries.length - 1);
    };

    function setSelected(index) {
        index = parseInt(index);
        if (index > -1 && index < $scope.entries.length) {
            $scope.selected = $scope.entries[index];
            $scope.index = index;
            $location.hash(index);
            return index;
        }
        return -1;
    }
});