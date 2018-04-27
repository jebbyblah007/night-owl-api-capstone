"use strict";
/*var map, infoWindow, service, request;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.8807956,
            lng: -77.1721968
        },
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');
            infoWindow.open(map);
            map.setCenter(pos);

            service = new google.maps.places.PlacesService(map);
            request = {
                location: pos,
                radius: '3000',
                type: ['cafe']
            };
            service.nearbySearch(request, function(data) {
                //console.log(data);
                data.forEach(
                    place => createMarker(place.name, place.geometry.location.lat(), place.geometry.location.lng())
                )
                data.forEach(function(element) {
                 //console.log(element);
                    service.getDetails({
                        placeId: element.place_id
                    }, function(place, status) {
                      console.log(place, status);
                        // if (status === google.maps.places.PlacesServiceStatus.OK) {
                        //     var marker = new google.maps.Marker({
                        //         map: map,
                        //         position: place.geometry.location
                        //     });
                        //     google.maps.event.addListener(marker, 'click', function() {
                        //         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        //             'Place ID: ' + place.place_id + '<br>' +
                        //             place.formatted_address + '</div>');
                        //         infowindow.open(map, this);
                        //     });
                        // }
                    });
                })
            });

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function createMarker(title, lat, lng) {
    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map: map,
        title: title,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    });
    var infowindow = new google.maps.InfoWindow({
        content: "replace with a function"
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}*/


//getFoursquareApi("", "", "Chicago, IL - replace with search query");

function getFoursquareApi(latitude, longitude, near) {
    //if city is not defined...
    if (near == "") {
        //check if latitude is defined...
        if ((latitude == "") || (latitude == undefined)) {
            //if not, use default NYC coordinates
            latitude = "40.730610"
        }
        //check if longitude is defined
        if ((longitude == "") || (longitude == undefined)) {
            //if not, use default NYC coordinates
            longitude = "-73.935242"
        }
        //with latitude and longitude coordinates defined, send to foursquare API
        var params = {
            //near: 'Chicago, IL',
            ll: latitude + "," + longitude,
            client_id: "0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV",
            client_secret: "XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV",
            v: '20180418'
        };
    }
    //if city is defined...
    else {
        //send it to foursquare API
        var params = {
            near: near,
            //ll: latitude + "," + longitude,
            client_id: "0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV",
            client_secret: "XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV",
            v: '20180418'
        };
    }
    var result = $.ajax({
            /* update API end point */
            url: "https://api.foursquare.com/v2/venues/search",
            data: params,
            dataType: "jsonp",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (allVenuesResults) {
            //            console.log(allVenuesResults);
            /* if the results are meaningful, we can just console.log them */
            // console.log(result);
            // console.log(result.response.venues[0].id);
            // loop through all the venues' ids
            $.each(allVenuesResults.response.venues, function (venuesArrayKey, venuesArrayValue) {
                //                console.log(venuesArrayValue.id);
                /* Get venue details by venue id*/
                var params = {
                    client_id: "0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV",
                    client_secret: "XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV",
                    v: '20180418'

                };
                var result = $.ajax({
                        /* update API end point */
                        url: "https://api.foursquare.com/v2/venues/" + venuesArrayValue.id + "/hours",
                        data: params,
                        dataType: "jsonp",
                        /*set the call type GET / POST*/
                        type: "GET"
                    })
                    /* if the call is successful (status 200 OK) show results */
                    .done(function (oneVenueResult) {
                        /* if the results are meeningful, we can just console.log them */
                        console.log(oneVenueResult);
                        console.log(oneVenueResult.response.hours);
                        console.log(Object.keys(oneVenueResult.response.hours).length);
                        //if hours are not specified...
                        if (Object.keys(oneVenueResult.response.hours).length === 0) {
                            //display error
                            console.log("Error");
                        } else { //display timeframes
                            console.log(oneVenueResult.response.hours.timeframes);
                        }
                    })
                    /* if the call is NOT successful show errors */
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                    });
            });
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        getFoursquareApi("", "", "");
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
        getFoursquareApi(latitude, longitude, "");
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
        getFoursquareApi("", "", "");
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
}
//Get places near geolocation via Foursquare. Line 108?//
//ask how to create findPlacesNearMe function (4square api) that has goFindMe function (google maps api) ALL ON CLICK (replace show my location button)//
/*
function getCoordinates() {
data = $.ajax call or API google maps
return { longitute: position.coords.longitude, lattitude: position.coords.lattitude }; }

function getEvents(location) {
data = $.ajax call or API call foursquare
return data.events; [ { title: , location: , time: , descr: , }, { title: , location: , time: , descr: , } ] }

const coordinates = getCoordinates();

getEvents(coordinates);*/
//ask how to create if else to filter hours//
