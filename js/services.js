var app = angular.module('app');

app.factory('contentFactory', function ($http, $q) {
    var service = {};

    service.getPortfolioData = function() {
        return $http.get('./content/portfolio/data.json');
    };

    service.getBlogData = function() {
        return $http.get('./content/blog/data.json');
    };

    service.getBlogPost = function(index) {
        var deferred = $q.defer();
        $http.get('./content/blog/data.json').success(function(data) {
            deferred.resolve({
                post: data['posts'][index]
            });
        });
        return deferred.promise;
    }
    return service;
});