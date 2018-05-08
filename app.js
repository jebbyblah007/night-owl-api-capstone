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
                console.log(item);
                //console.log(item.id);
//                if (item.categories[0].id === '4bf58dd8d48988d1e0931735' || item.categories[0].id === '4bf58dd8d48988d16d941735' || item.categories[0].id === '4bf58dd8d48988d114951735') {
//                    console.log(item); //coffee shops, cafes, or bookstores
//
//                } else {
//
//                }
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

