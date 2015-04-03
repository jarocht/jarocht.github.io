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

app.controller('portfolioCtrl', function($scope) {

});

app.controller('blogCtrl', function($scope, $firebase) {
    var ref = new window.Firebase(baseUrl + "blog");
    var blogPosts = $firebase(ref).$asArray();
    blogPosts.$loaded().then(function () {
        console.log(blogPosts[blogPosts.length - 1].$id);
        $scope.blogPosts = blogPosts;
        $scope.post = blogPosts[blogPosts.length - 1];
    });
    $scope.id = 5;
});

app.controller("blogPostCtrl", function ($scope, $firebase, $stateParams) {
    console.log($stateParams);
});

app.controller("contentNavigatorCtrl", function ($scope, $firebase, $stateParams, $state) {
    console.log($stateParams.type);
    if ($stateParams.type != "portfolio" && $stateParams.type != "blog") {
        $state.go("about");
    }
    $scope.title = "Jaroch XYZ";
    $scope.subTitle = "Jaroch Subtitle Text";

    function provisionPages() {
        $scope.pages = [];
        for (var i = 0; i < $scope.numPages; i++)
            $scope.pages.push([]);
        for (i = 0; i < $scope.postCount; i++) {
            $scope.pages[Math.floor(i / $scope.postsPerPage)].push($scope.posts.$getRecord($scope.posts.$keyAt(i)));
        }
        console.log("Pages size: " + $scope.pages.length);
    }

    $scope.getPostList = function () {
        var posts = [];
        var start = $scope.postsPerPage * $scope.selectedPage;
        var end = $scope.postsPerPage + start;
        if (end > $scope.postCount)
            end = $scope.postCount;
        for (var i = start; i < end; i++) {
            posts.push($scope.posts.$getRecord($scope.posts.$keyAt(i)));
        }
        return posts;
    }

    var ref = new window.Firebase(baseUrl + "blog");
    $scope.posts = $firebase(ref).$asArray();
    $scope.posts.$loaded().then(function () {
        $scope.postCount = $scope.posts.length;
        $scope.selectedPage = 0;
        $scope.postsPerPage = 3;
        $scope.numPages = Math.ceil($scope.postCount / $scope.postsPerPage);
        provisionPages();
    });

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

/*
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
        scrollToTop($window);
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
    $scope.postsPerPage = 9;
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
        scrollToTop($window);
        if($scope.selectedPage > $scope.numPages - 1)
            setSelectedPage($scope.numPages - 1);
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
            $scope.showNextButton = (index < $scope.posts.length - 1);
            $scope.showPrevButton = (index > 0);
            $scope.post = $scope.posts[index];
            $location.hash(index);
            scrollToTop($window);
            return index;
        }
        return -1;
    };
});

app.controller('contactCtrl', function($scope, $window, $location) {
    $scope.contactImageUrl = 'img/headshot_round_color.png';

    $scope.showAltContactImage = function(bool) {
        if (bool)
            $scope.contactImageUrl = 'img/headshot_round_bw.png';
        else {
            $scope.contactImageUrl = 'img/headshot_round_color.png';
        }
    };
});

app.controller('testCtrl', function ($scope, $firebase) {
    function authHandler(error) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully");
            load();
        }
    }

    var baseUrl = "https://timjaroch.firebaseio.com/";
    var ref = new window.Firebase(baseUrl);
    ref.authWithPassword({
        email: "tim.jaroch@gmail.com",
        password: "secret"
    }, authHandler);

    function load() {
        console.log("now");
        var newref = new window.Firebase(baseUrl + "sensitive");
        $scope.types = $firebase(newref).$asArray();
        $scope.types.$loaded().then(function () {
            console.log($scope.types);
        });
    };



});

function scrollToTop(window) {
    window.scrollTo(0, 0);
}*/