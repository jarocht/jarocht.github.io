var app = angular.module('app');

app.factory('contentFactory', function ($http) {
    var service = {};

    service.getPortfolioData = function() {
        return $http.get('./content/portfolio/data.json');
    };

    service.getBlogData = function() {
        return $http.get('./content/blog/data.json');
    };

    return service;
});