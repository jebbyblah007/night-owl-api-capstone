"use strict";
//Step 1: Define global variables, functions, and objects.
//old
let currentClientID = "0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV";
let currentClientSecret = "XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV";
//new
//let currentClientID = "DLSSGTGP1QJUSSZREI54AVLBKRP31PQYVMKSEORODLUQF5B3";
//let currentClientSecret = "FD3F1GRHIIRW21HJD14VVCPVBBAMRON4LKMY3FLFEHMVTGK3";
const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/search?&client_id=" + currentClientID + "&client_secret=" + currentClientSecret + "&v=20180505";

//get current location
function geoFindMe() {
    var output = document.getElementById("out");
    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        getFoursquareApi("", "", "");
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $('.container').show();
        $('.start-section').hide();
        $('.thumb').hide();
        getFoursquareApi(latitude, longitude, "");
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
        getFoursquareApi("", "", "");
    }
    output.innerHTML = "<p>Locating…</p>";
    navigator.geolocation.getCurrentPosition(success, error);
}

//get foursquare info
function getFoursquareApi(latitude, longitude) {
    $.ajax(FOURSQUARE_SEARCH_URL, {
        data: {
            ll: latitude + "," + longitude,
            categoryId: '4d4b7105d754a06376d81259',
            limit: 50,
            //2 mile radius
            radius: 3218,
            //5 mile radius = 8047
        },
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            //console.log(data);
            let results = data.response.venues.map(function (item, index) {
                //console.log(item);
                getHours(item, item.id, item.name);
            });
            $('#foursquare-results').html(results);
        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No data found.</p></div>");
        }
    });
}

//get current time
function getHours(result, venueId, venueName) {
    var d = new Date();
    var day = d.getDay();
    var hour = d.getHours().toString();
    //if length of hour is 1 digit, add 0 at beginning of it
    hour = hour.length === 1 ? `0${hour}` : hour;
    var minute = d.getMinutes().toString();
    //if length of minute is 1 digit, add 0 at beginning of it
    minute = minute.length === 1 ? `0${minute}` : minute;
    //hourMinute is combination of both
    var hourMinute = hour + minute;
    //console.log(hourMinute, day);
    getVenueDetailsByVenueId(result, venueId, venueName, hourMinute);
}

//get venues' details that include start and end time using venue Id
function getVenueDetailsByVenueId(result, venueId, venueName, hourMinute) {
    $.ajax("https://api.foursquare.com/v2/venues/" + venueId + "/hours?&client_id=" + currentClientID + "&client_secret=" + currentClientSecret + "&v=20180505", {
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            displayVenueDetailsByVenueId(result, data, venueName, hourMinute);
        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No Open Venues.</p></div>");
        }
    })
}

//display venues that are currently open
function displayVenueDetailsByVenueId(result, data, venueName, hourMinute) {
    let currentVenueName = "";
    let oldVenueName = "";
    if (data.response.hours.timeframes) {
        for (var i = 0; i < data.response.hours.timeframes.length; i++) {
            currentVenueName = result.categories[0].name;
            //console.log(data.response.hours.timeframes[i]);
            var start = data.response.hours.timeframes[i].open[0].start;
            var end = data.response.hours.timeframes[i].open[0].end;
            //console.log(start, end, hourMinute);
            //only show results if the current day matches the scheduled one
            var includesToday = data.response.hours.timeframes[i].includesToday;
            //console.log(includesToday);
            if ((includesToday != undefined) && (includesToday != null) && (includesToday != "") && (includesToday == true)) {
                //check if current time is within venue's start and end time
                if (
                    (
                        (hourMinute < '2400') &&
                        (hourMinute > start)
                    ) ||
                    (
                        (hourMinute < '0000') &&
                        (hourMinute > end)
                    )
                ) {
                    //console.log("Open Now");
                    let htmlOutput = `<section role="region" class="result ${result.categories[0].name} col-3" aria-live="polite">
                        <h2 class="result-name">${result.name}</h2>
                        <div class="icon">
                        <img src="${result.categories[0].icon.prefix}bg_32${result.categories[0].icon.suffix}" alt="category-icon">
                        </div>
                        <span class="icon-text">
                        ${result.categories[0].name}
                        </span>
                        <p class="result-address">${result.location.formattedAddress[0]}</p>
                        <p class="result-address">${result.location.formattedAddress[1]}</p>
                        <p class="result-address">${result.location.formattedAddress[2]}</p>
                        </div>
                        </section>`;
                    if (currentVenueName != oldVenueName) {
                        $('#foursquare-results').append(htmlOutput);
                    }
                }
            } else {
                //console.log("Closed");
            }
            currentVenueName = oldVenueName;
        }
    }
}

//Step 2: Use global variables, functions, and objects. (triggers)
$(document).ready(function () {
    $('.start-section').show();
    $('.container').hide();
});
$(document).on('click', '#showFood', function (event) {
    event.preventDefault();
    $('.result').hide();
    $('.Restaurant').show();
    $('.Pizza').show();
});
$(document).on('click', '#showBars', function (event) {
    event.preventDefault();
    $('.result').hide();
    $('.Bar').show();
    $('.Beer').show();
    $('.Brewery').show();
});
$(document).on('click', '#showCoffee', function (event) {
    event.preventDefault();
    $('.result').hide();
    $('.Coffee').show();
    $('.Cafe').show();
    $('.Bookstore').show();
});
$(document).on('click', '#goBack', function (event) {
    event.preventDefault();
    location.reload();
});
$(document).on('click', '#showOpen', function (event) {
    event.preventDefault();
    $('.result').show();
});
