var app = angular.module('app');

app.factory('contentFactory', function ($http) {
    var service = {};

    service.getPortfolioData = function() {
        return $http.get('./content/portfolio/data.json');
    };

    return service;
});