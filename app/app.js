'use strict';
// Declare app level module which depends on views, and components
angular.module('e-Weather', [
  'ngRoute',
'ngMaterial',
'ngAnimate',
'ngAria'
])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: './'});
}])


//if (window.location.protocol != "https:")
//  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length); i researched this from stack overflow




.controller('WeatherSearch', function($scope, $http){
    $scope.googleHash = '&key=AIzaSyCIdzxbd9ouVnupvSqEN3DTR-O3oLL05zo';
    $scope.openHash = '&APPID=4b576078d187b9c1aeec6c1ace6cc319';
    if ($scope.weatherSearchInput === undefined){
        autoLocate();
    };
    //Inject Search Bar's Variable Value into the fucntion for Geocode to Occur After Punch.
    $scope.srch = function(){

        if ($scope.weatherSearchInput === undefined){
            return autoLocate();
        }
        else if ($scope.weatherSearchInput !== undefined){
            $scope.startSearch = $scope.weatherSearchInput;
            return punch();
        };
    };
    function autoLocate(){
        if ($scope.weatherSearchInput === undefined){
            navigator.geolocation.getCurrentPosition(fetchPosition);
            function fetchPosition(clientLoc){
                $scope.navLat = clientLoc.coords.latitude;
                $scope.navLon = clientLoc.coords.longitude;
                $scope.latLng = $scope.navLat + ',' + $scope.navLon;
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.latLng + $scope.googleHash)
                    .then(function(cooked){
                    $scope.geoCoded = cooked.data;
                    $scope.geoLat = $scope.geoCoded.results[0].geometry.location.lat;
                    $scope.geoLon = $scope.geoCoded.results[0].geometry.location.lng;
                    var map = new google.maps.Map(document.getElementById('myMap'),{
                        zoom: 10,
                        center: {lat: $scope.geoLat, lng: $scope.geoLon},
                    });
                    $scope.marker = new google.maps.Marker({
                        map: map,
                        position: {lat: $scope.geoLat, lng: $scope.geoLon}
                    });
                    $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + $scope.geoLat + '&lon=' + $scope.geoLon + '&type=accurate' + $scope.openHash)
                        .then(function(render){$scope.weatherResults = render.data;
                                               console.log($scope.weatherResults);
                                               $scope.currTemp = Math.round(($scope.weatherResults.main.temp - 273) * 100) / 100;
                                               console.log($scope.currTemp);
                                               console.log(typeof $scope.currTemp);
                                               var ic = "http://openweathermap.org/img/w/";
                                               var on = $scope.weatherResults.weather[0].icon;
                                               var set = ".png";
                                               $scope.iconSetDesc = $scope.weatherResults.weather[0].description;
                                               $scope.iconSet = ic + on + set;
                                               console.log($scope.iconSet);
                                            });
                });
            };
        };
    };




    function punch(){



        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.startSearch + $scope.googleHash)
            .then(function(cooked){
            $scope.geoCoded = cooked.data;
            $scope.geoLat = $scope.geoCoded.results[0].geometry.location.lat;
            $scope.geoLon = $scope.geoCoded.results[0].geometry.location.lng;


            map = new google.maps.Map(document.getElementById('myMap'),{
                zoom: 10,
                center: {lat: $scope.geoLat, lng: $scope.geoLon}
            });


            $scope.marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.geoLat, $scope.geoLon),
                map: map
            });



            $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + $scope.geoLat + '&lon=' + $scope.geoLon + '&type=accurate' + $scope.openHash)
                .then(function(render){$scope.weatherResults = render.data;

                                       $scope.currTemp = Math.round(($scope.weatherResults.main.temp - 273) * 100) / 100;
                                       console.log($scope.currTemp);
                                       console.log(typeof $scope.currTemp);

                                       var ic = "http://openweathermap.org/img/w/";
                                       var on = $scope.weatherResults.weather[0].icon;
                                       var set = ".png";
                                       $scope.iconSetDesc = $scope.weatherResults.weather[0].description;

                                       $scope.iconSet = ic + on + set;
                                       console.log($scope.iconSet);

                                      });


        });
    };







});




