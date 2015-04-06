var app = angular.module('app');
var baseUrl = "https://timjaroch.firebaseio.com/";

app.controller('aboutCtrl', function($scope) {
});

app.controller('contactCtrl', function ($scope, $location) {
    $scope.contactImageUrl = 'img/headshot_round_color.png';

    $scope.showAltContactImage = function (bool) {
        if (bool)
            $scope.contactImageUrl = 'img/headshot_round_bw.png';
        else {
            $scope.contactImageUrl = 'img/headshot_round_color.png';
        }
    };
    //load google map
    initialize();
});

app.controller("blogPostCtrl", function ($scope, $firebase, $stateParams) {
    console.log($stateParams);
});

app.controller("contentNavigatorCtrl", function ($scope, $firebaseObject, $firebaseArray, $stateParams, $state) {

    var posts = undefined;
    var content = undefined;
    $scope.title = "Title Loading...";
    $scope.subTitle = "Subtitle Loading...";

    if ($stateParams.type == "portfolio") {
        posts = new window.Firebase(baseUrl + "portfolio/posts");
        content = new window.Firebase(baseUrl + "portfolio");
    } else if ($stateParams.type == "blog") {
        posts = new window.Firebase(baseUrl + "blog/posts");
        content = new window.Firebase(baseUrl + "blog");
    } else {
        $state.go("about");
        return;
    }

    function provisionPages() {
        $scope.pages = [];
        for (var i = 0; i < $scope.numPages; i++)
            $scope.pages.push([]);
        for (i = 0; i < $scope.postCount; i++) {
            $scope.pages[Math.floor(i / $scope.postsPerPage)].push($scope.posts.$getRecord($scope.posts.$keyAt(i)));
        }
    }

    content = $firebaseObject(content);
    content.$loaded().then(function () {
        $scope.title = content.title;
        $scope.subTitle = content.subTitle;
    });

    $scope.posts = $firebaseArray(posts);
    $scope.posts.$loaded().then(function () {
        $scope.postCount = $scope.posts.length;
        $scope.selectedPage = 0;
        $scope.postsPerPage = 3;
        $scope.numPages = Math.ceil($scope.postCount / $scope.postsPerPage);
        provisionPages();
    });

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