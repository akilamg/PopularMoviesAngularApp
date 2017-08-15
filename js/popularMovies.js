angular
.module('popularMovies', ['ngMaterial', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'static/templates/home.html',
            controller: 'homeCtrl'
        })
        .state('movieList', {
            url: '/movieList',
            templateUrl: 'static/templates/movieList.html',
            controller: 'movieListCtrl'
        })
        .state('movie', {
            url: '/movie/:id',
            templateUrl: 'static/templates/movie.html',
            controller: 'movieCtrl'
        })
})
.controller('homeCtrl', homeController)
.controller('movieListCtrl', movieListController)
.controller('movieCtrl', movieController)
.service('sharedProperties', function ($http) {
    var movies = [];
    var APIkey = '';

    return {
        getMovies: function () {
            return movies;
        },
        getMovie: function (id) {
            return movies[id];
        },
        PopulateMovies: function(var1, callback) {
            $http({method: 'GET', url: '/APIkey'})
            .then(function(response){
                APIkey = response.data;
                return $http({method: 'GET', url: 'http://api.themoviedb.org/3/movie/popular', params: {api_key: APIkey}})
            })
            .then(function successCallback(response) {
                angular.forEach(response.data.results, function(movie, $index){
                    $http({method: 'GET', url: 'http://api.themoviedb.org/3/movie/' + movie.id, params: {api_key: APIkey}})
                    .then(function successCallback(response) {
                        movies.push(
                        {
                            id: $index,
                            title: movie.title,
                            image: "http://image.tmdb.org/t/p/w185" + movie.poster_path,
                            overview: movie.overview,
                            rating: movie.vote_average,
                            date: movie.release_date,
                            duration: response.data.runtime
                        });

                        if(callback && typeof callback == "function" ) callback(var1);

                    }, function errorCallback(response) {
                        console.error("Failed to retrieve movie data from themoviedb.org for movieId:" + movie.id);
                    });
                });
            });
        },
    };
});

function homeController($scope, $state, sharedProperties){
    sharedProperties.PopulateMovies('movieList', $state.transitionTo);
}

function movieListController ($scope, $state, sharedProperties) {
    $scope.movies = sharedProperties.getMovies();

    if($scope.movies.length == 0){
        sharedProperties.PopulateMovies();
    }

    $scope.display = function(movieId){
        $state.transitionTo('movie', {id: movieId});
    }
}

function movieController($scope, $state, $stateParams, sharedProperties){
    $scope.data = sharedProperties.getMovie($stateParams.id);
    $scope.return = function(){
        $state.transitionTo('movieList');
    }
}