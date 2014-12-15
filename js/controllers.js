﻿var app = angular.module('app', ['ngSanitize'])
.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('portfolioCtrl', function ($scope, $window, $location, contentFactory) {
    //init vars
    $scope.index = 0;
    $scope.selected = {};
    var promise = contentFactory.getPortfolioData();
    promise.then(
        function(payload) {
            $scope.entries = payload.data['entries'];
            $scope.defaultImageUrl = payload.data['defaultImageUrl'];
            if (setSelected(parseInt($location.hash()) -1) == -1)
                setSelected(0);
            $scope.ShowImgLeftNavArrow = false;
            $scope.ShowImgRightNavArrow = false;
        }
    );

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
            $location.hash(index + 1);
            return index;
        }
        return -1;
    };
});

app.controller('blogCtrl', function ($scope, $window, $location, contentFactory) {
    $scope.postsPerPage = 3;
    $scope.numPages = 1;
    $scope.selectedPage = 0;
    $scope.pages = [];
    $scope.posts = {};
    var promise = contentFactory.getBlogData();
    promise.then(
        function (payload) {
            $scope.posts = payload.data['posts'];
            $scope.defaultImageUrl = payload.data['defaultImageUrl'];
            provisionPages();
            if (setSelectedPage(parseInt($location.hash()) - 1) == -1)
                setSelectedPage(0);
        });

    $scope.previousPage = function() {
        setSelectedPage($scope.selectedPage - 1);
    };

    $scope.nextPage = function() {
        setSelectedPage($scope.selectedPage + 1);
    }

    $scope.setPage = function(index) {
        setSelectedPage(index);
    }

    $scope.setPostsPerPage = function(num) {
        $scope.postsPerPage = parseInt(num);
        provisionPages();
        scrollToTop();
        if($scope.selectedPage > $scope.numPages - 1)
            setSelectedPage($scope.numPages - 1);
    }

    function scrollToTop() {
        $window.scrollTo(0, 0);
    }

    function setSelectedPage(index) {
        index = parseInt(index);
        if (index > -1 && index < $scope.numPages) {
            $scope.selectedPage = index;
            $location.hash(index + 1);
            return index;
        }
        return -1;
    };

    function provisionPages() {
        $scope.pages = [];
        $scope.numPages = Math.ceil($scope.posts.length / $scope.postsPerPage);
        if ($scope.numPages < 1)
            $scope.numPages = 1;
        for (var i = 0; i < $scope.numPages; i++)
            $scope.pages.push([]);
        for (i = 0; i < $scope.posts.length; i++) {
            $scope.pages[Math.floor(i / $scope.postsPerPage)].push({ 'content': $scope.posts[i], 'index' : i });
        }
    };
});

app.controller('blogPostCtrl', function ($scope, $window, $location, contentFactory) {
    $scope.posts = {};
    $scope.post = {};
    var promise = contentFactory.getBlogData();
    promise.then(
        function (payload) {
            $scope.posts = payload.data['posts'];
            $scope.post = $scope.posts[$scope.index];
            $scope.defaultImageUrl = payload.data['defaultImageUrl'];
            setSelectedPage($location.hash());
        });

    $scope.previousPost = function() {
        setSelectedPage($scope.index - 1);
    };

    $scope.nextPost = function() {
        setSelectedPage($scope.index + 1);
    }

    $scope.getPost = function (index) {
        if (index > -1 && index < $scope.posts.length) {
            return $scope.posts[index];
        }
        return $scope.posts[0];
    };

    $scope.$on('$locationChangeSuccess', function () {
        setSelectedPage($location.hash());
    });

    function setSelectedPage(index) {
        index = (index == parseInt(index, 10)) ? parseInt(index) : 0;
        if (index > -1 && index < $scope.posts.length) {
            $scope.index = index;
            $scope.post = $scope.posts[index];
            $location.hash(index);
            $window.scrollTo(0, 0);
            return index;
        }
        return -1;
    };
});