var app = angular.module('app');

app.factory('contentFactory', function ($http, $q) {
    var service = {};

    service.getPortfolioData = function() {
        return $http.get('./content/portfolio/data.json');
    };

    service.getBlogData = function() {
        return $http.get('./content/blog/data.json');
    };

    service.getBlogPost = function (index) {
        index = (index == parseInt(index, 10)) ? parseInt(index) : 0;
        var deferred = $q.defer();
        $http.get('./content/blog/data.json').success(function (data) {
            if (index < 0 || index >= data['posts'].length)
                index = 0;
            var titles = [];
            for (var i = 0; i < data['posts'][index]['related'].length; i++) {
                titles.push(data['posts'][data['posts'][index]['related'][i]]['title']);
            }
            deferred.resolve({
                post: data['posts'][index],
                relatedTitles: titles,
                index: index
        });
        });
        return deferred.promise;
    }
    return service;
});