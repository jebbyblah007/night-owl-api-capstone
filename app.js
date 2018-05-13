"use strict";

function startHere() {
    $(document).ready(function () {
        $('.start-section').show();
        $('.container').hide();
    })
}
startHere();
const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/search?&client_id=0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV&client_secret=XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV&v=20180418"

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
            limit: 50,
            radius: 8047,
        },
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            let results = data.response.venues.map(function (item, index) {
                //console.log(item);
                getHours(item.id, item.name);
                return displayResults(item);

            });
            $('#foursquare-results').html(results);
            //scrollPageTo('#foursquare-results', 15);
        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No data found.</p></div>");
        }
    });
}


function getHours(venueId, venueName) {
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
    console.log(hourMinute);
    $.ajax(`https://api.foursquare.com/v2/venues/${venueId}/hours?&client_id=0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV&client_secret=XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV&v=20180418`, {
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data, venueName);



            /*console.log(hours.response.popular.timeframes);
            //                            console.log(hours.response.popular.timeframes[0].open[0].start);
            //                            console.log(hours.response.popular.timeframes[0].open[0].end);
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();
            var currentTime = '' + h + m;
            console.log(currentTime);*/







            if (data.response.hours.timeframes) {
                var timeframe = data.response.hours.timeframes.filter(timeframe => timeframe.days.includes(day));
                console.log(timeframe);
                for (var i = 0; i < timeframe.length; i++) {
                    var start = timeframe[i].open[0].start;
                    var end = timeframe[i].open[0].end;
                    console.log(start + ' ' + end);
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
                    } else {
                        console.log("Closed");
                    }
                }
            }

        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Error. No Open Venues.</p></div>");
        }
    })
}

function displayResults(result) {
    return `
<div class="result ${result.categories[0].name} col-3">
<h2 class="result-name"><a href="${result.url}" target="_blank">${result.name}</a></h2>
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
}
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
