"use strict";

function startHere() {
    $(document).ready(function () {
        $('.start-section').show();
        $('.container').hide();
    })
}
startHere();
const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore?&client_id=0EFO1LZES0FQBZIXAEGMZNWXHHDAIZZCJ10LWFCHKIP4LWCV&client_secret=XX4GIMFENPBMUTOMGCN1CI0JEG2IFGYSBTLUV3ASHBHQZNMV&v=20180418"
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
            limit: 50
        },
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            if (data.response.totalResults != 0) {
                let results = data.response.groups[0].items.map(function (item, index) {
                    console.log(item);
                    return displayResults(item);
                });
                $('#foursquare-results').html(results);
                scrollPageTo('#foursquare-results', 15);
            } else {
                $('#foursquare-results').html("<div class='result'><p>No Results Found</p></div>");
            }

        },
        error: function () {
            $('#foursquare-results').html("<div class='result'><p>Whoopsie! Let's try that again.</p></div>");
        }
    });
}

function displayResults(result) {
    return `
<div class="result col-3">
<h2 class="result-name"><a href="${result.venue.url}" target="_blank">${result.venue.name}</a></h2>
<span class="icon">
<img src="${result.venue.categories[0].icon.prefix}bg_32${result.venue.categories[0].icon.suffix}" alt="category-icon">
</span>
<span class="icon-text">
${result.venue.categories[0].name}
</span>
<p class="result-address">${result.venue.location.formattedAddress[0]}</p>
<p class="result-address">${result.venue.location.formattedAddress[1]}</p>
<p class="result-address">${result.venue.location.formattedAddress[2]}</p>
</div>
</div>
`;
}
