var app = angular.module('app');
var baseUrl = "https://timjaroch.firebaseio.com/";

app.factory('contentManagerFactory', function ($q, $firebaseObject, $firebaseArray) {
    var service = {};

    var portfolioPosts = undefined;
    var portfolioContent = undefined;
    var blogPosts = undefined;
    var blogContent = undefined;

    service.getPorfolioPosts = function () {
        var def = $q.defer();
        if (portfolioPosts == undefined) {
            portfolioPosts = $firebaseArray(new window.Firebase(baseUrl + "portfolio/posts"));
            portfolioPosts.$loaded(function() {
                def.resolve(portfolioPosts);
            });
        } else {
            def.resolve(portfolioPosts);
        }

        return def.promise;
    }

    service.getPorfolioPost = function(id) {
        var def = $q.defer();
        if (portfolioPosts == undefined) {
            portfolioPosts = $firebaseArray(new window.Firebase(baseUrl + "portfolio/posts"));
            portfolioPosts.$loaded(function () {
                for (var i = 0; i < portfolioPosts.length; i++) {
                    if (portfolioPosts[i].$id == id) {
                        def.resolve(portfolioPosts[i]);
                    }
                }
                def.reject();
            });
        } else {
            for (var i = 0; i < portfolioPosts.length; i++) {
                if (portfolioPosts[i].$id == id) {
                    def.resolve(portfolioPosts[i]);
                }
            }
            def.reject();
        }

        return def.promise;
    }

    service.getBlogPosts = function () {
        var def = $q.defer();
        if (blogPosts == undefined) {
            blogPosts = $firebaseArray(new window.Firebase(baseUrl + "blog/posts"));
            blogPosts.$loaded(function () {
                def.resolve(blogPosts);
            });
        } else {
            def.resolve(blogPosts);
        }

        return def.promise;
    }

    service.getBlogPost = function (id) {
        var def = $q.defer();
        if (blogPosts == undefined) {
            blogPosts = $firebaseArray(new window.Firebase(baseUrl + "blog/posts"));
            blogPosts.$loaded(function () {
                for (var i = 0; i < blogPosts.length; i++) {
                    if (blogPosts[i].$id == id) {
                        def.resolve(blogPosts[i]);
                    }
                }
                def.reject();
            });
        } else {
            for (var i = 0; i < blogPosts.length; i++) {
                if (blogPosts[i].$id == id) {
                    def.resolve(blogPosts[i]);
                }
            }
            def.reject();
        }

        return def.promise;
    }

    service.getPortfolioContent = function () {
        var def = $q.defer();
        if (portfolioContent == undefined) {
            portfolioContent = $firebaseObject(new window.Firebase(baseUrl + "portfolio"));
            portfolioContent.$loaded(function () {
                def.resolve(portfolioContent);
            });
        } else {
            def.resolve(portfolioContent);
        }

        return def.promise;
    }

    service.getBlogContent = function () {
        var def = $q.defer();
        if (blogContent == undefined) {
            blogContent = $firebaseObject(new window.Firebase(baseUrl + "blog"));
            blogContent.$loaded(function () {
                def.resolve(blogContent);
            });
        } else {
            def.resolve(blogContent);
        }

        return def.promise;
    }

    return service;
});

app.controller('aboutCtrl', function($scope) {
});

app.controller('contactCtrl', function ($scope, $location) {
    var colorImage = 'content/site/img/headshot_round_color.png';
    var bwImage = 'content/site/img/headshot_round_bw.png';
    $scope.contactImageUrl = colorImage;

    $scope.showAltContactImage = function (bool) {
        $scope.contactImageUrl = bool ? bwImage : colorImage;
    };
    //load google map
    initialize();
});

app.controller("contentPostCtrl", function ($scope, $firebaseObject, $stateParams, $state, contentManagerFactory) {
    if ($stateParams.type == "portfolio" && $stateParams.id != "") {
        contentManagerFactory.getPorfolioPost($stateParams.id).then(function (post) {
            $scope.post = post;
        }, function (error) {
            $state.go("contentNavigator", {type: 'portfolio'});
        });

        contentManagerFactory.getPortfolioContent().then(function(content) {
            $scope.title = content.title;
            $scope.subTitle = content.subTitle;
        });
    } else if ($stateParams.type == "blog" && $stateParams.id != "") {
        contentManagerFactory.getBlogPost($stateParams.id).then(function (post) {
            $scope.post = post;
        }, function (error) {
            $state.go("contentNavigator", { type: 'blog' });
        });

        contentManagerFactory.getBlogContent().then(function (content) {
            $scope.title = content.title;
            $scope.subTitle = content.subTitle;
        });
    } else {
        $state.go("about");
        return;
    }
});

app.controller("contentNavigatorCtrl", function ($scope, $firebaseObject, $firebaseArray, $stateParams, $state, contentManagerFactory) {
    $scope.title = "Title Loading...";
    $scope.subTitle = "Subtitle Loading...";
    $scope.type = $stateParams.type;

    if ($stateParams.type == "portfolio") {
        contentManagerFactory.getPorfolioPosts().then(function (data) {
            $scope.posts = data;
            provision();
        });

        contentManagerFactory.getPortfolioContent().then(function (content) {
            $scope.title = content.title;
            $scope.subTitle = content.subTitle;
        });


    } else if ($stateParams.type == "blog") {
        contentManagerFactory.getBlogPosts().then(function (data) {
            $scope.posts = data;
            provision();
        });

        contentManagerFactory.getBlogContent().then(function (content) {
            $scope.title = content.title;
            $scope.subTitle = content.subTitle;
        });
    } else {
        $state.go("about");
        return;
    }

    function provision() {
        $scope.postCount = $scope.posts.length;
        $scope.selectedPage = 0;
        $scope.postsPerPage = 3;
        $scope.numPages = Math.ceil($scope.postCount / $scope.postsPerPage);
        provisionPages();
    }

    function provisionPages() {
        $scope.pages = [];
        for (var i = 0; i < $scope.numPages; i++)
            $scope.pages.push([]);
        for (i = 0; i < $scope.postCount; i++) {
            $scope.pages[Math.floor(i / $scope.postsPerPage)].push($scope.posts.$getRecord($scope.posts.$keyAt(i)));
        }
    }

    $scope.getPostList = function () {
        var postList = [];
        var start = $scope.postsPerPage * $scope.selectedPage;
        var end = $scope.postsPerPage + start;
        if (end > $scope.postCount)
            end = $scope.postCount;
        for (var i = start; i < end; i++) {
            postList.push($scope.posts.$getRecord($scope.posts.$keyAt(i)));
        }
        return postList;
    }

    $scope.setSelectedPage = function (index) {
        if (index <= $scope.numPages - 1 && index > -1) {
            $scope.selectedPage = index;
        }
    }

    $scope.setPostsPerPage = function(count) {
        if (count == 3 || count == 9 || count == 27) {
            $scope.postsPerPage = count;
            $scope.selectedPage = 0;
            $scope.numPages = Math.ceil($scope.postCount / $scope.postsPerPage);
            provisionPages();
        }
    }
});

function scrollToTop(window) {
    window.scrollTo(0, 0);
}

/* google maps */
function initialize() {
    var varLocation = new window.google.maps.LatLng(42.9633333, -85.6680556);

    var roadAtlasStyles = [{ "featureType": "administrative", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "stylers": [{ "visibility": "simplified" }, { "color": "#102E14" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, {}];

    var varMapoptions = {
        scrollwheel: true,
        draggable: true,
        center: varLocation,
        disableDefaultUI: true,
        zoom: 12
    };

    var varMap = new window.google.maps.Map(document.getElementById("map-container"), varMapoptions);

    var styledMapOptions = {};

    var usRoadMapType = new window.google.maps.StyledMapType(
		roadAtlasStyles, styledMapOptions);

    varMap.mapTypes.set('usroadatlas', usRoadMapType);
    varMap.setMapTypeId('usroadatlas');

    var mapText = document.createElement('button');
    mapText.className = "btn btn-info btn-lg";
    mapText.innerHTML = 'Located in West Michigan';
    var mapTextA = document.createElement('a');
    mapTextA.setAttribute('href', "contact.html");
    mapTextA.setAttribute('target', "_self");
    mapTextA.appendChild(mapText);
    varMap.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(mapTextA);
}
/* end google maps */