var app = angular.module('app', ['ngSanitize', 'firebase', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    //For any unmatched URL redirect to /about
    $urlRouterProvider.otherwise("/about");

    //state configuration
    $stateProvider
        .state("about", {
            url: "/about",
            templateUrl: "partials/about.html",
            controller: "aboutCtrl"
        })
        .state("contact", {
            url: "/contact",
            templateUrl: "partials/contact.html",
            controller: "contactCtrl"
        })
        .state("contentNavigator", {
            url: "/contentNavigator/{type}",
            templateUrl: "partials/contentNavigator.html",
            controller: "contentNavigatorCtrl"
        })
        .state("contentPost", {
            url: "/posts/{type}/{id}",
            templateUrl: "partials/contentPost.html",
            controller: "contentPostCtrl"
        });
});