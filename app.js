"use strict";
//old
//let currentClientID = "0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV";
//let currentClientSecret = "XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV";

//new
let currentClientID = "DLSSGTGP1QJUSSZREI54AVLBKRP31PQYVMKSEORODLUQF5B3";
let currentClientSecret = "FD3F1GRHIIRW21HJD14VVCPVBBAMRON4LKMY3FLFEHMVTGK3";

function startHere() {
    $(document).ready(function () {
        $('.start-section').show();
        $('.container').hide();
    })
}
startHere();
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
        //        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
        $('.container').show();
        /*$('#trial:has(img[alt="food.jpg"])').click(function() {
  alert( "SUCCESS" );
});*/
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
            limit: 25,
            //2 mile radius
            radius: 3218,
            //5 mile radius = 8047
        },
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            let results = data.response.venues.map(function (item, index) {
                console.log(item);
                getHours(item, item.id, item.name);

            });
            $('#foursquare-results').html(results);
            //scrollPageTo('#foursquare-results', 15);
        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No data found.</p></div>");
        }
    });
}


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
    console.log(hourMinute, day);



    $.ajax("https://api.foursquare.com/v2/venues/" + venueId + "/hours?&client_id=" + currentClientID + "&client_secret=" + currentClientSecret + "&v=20180505", {
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data, venueName);
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
                    console.log(includesToday);
                    if ((includesToday != undefined) && (includesToday != null) && (includesToday != "") && (includesToday == true)) {

                        //check for current hour
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
                            console.log("Open Now");


                            let htmlOutput = `
                                <div class="result ${result.categories[0].name} col-3">
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
                                </div>
                                `;
                            if (currentVenueName != oldVenueName) {
                                $('#foursquare-results').append(htmlOutput);

                            }
                        }



                    } else {
                        console.log("Closed");
                    }
                    currentVenueName = oldVenueName;
                }
            }

        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No Open Venues.</p></div>");
        }
    })
}

//function displayResults(result, start, end) {
//    console.log(result);
//
//    let currentVenueName = "";
//
//    let htmlOutput = `
//<div class="result ${result.categories[0].name} col-3">
//<h2 class="result-name"><a href="${result.url}" target="_blank">${result.name}</a></h2>
//<div class="icon">
//<img src="${result.categories[0].icon.prefix}bg_32${result.categories[0].icon.suffix}" alt="category-icon">
//</div>
//<span class="icon-text">
//${result.categories[0].name}
//</span>
//<p class="result-address">${result.location.formattedAddress[0]}</p>
//<p class="result-address">${result.location.formattedAddress[1]}</p>
//<p class="result-address">${result.location.formattedAddress[2]}</p>
//<p class="result-address">Opened ${start} till ${end} </p>
//</div>
//</div>
//`;
//
//    $('#foursquare-results').append(htmlOutput);
//}
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
