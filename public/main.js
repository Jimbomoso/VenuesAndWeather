// Foursquare API Info
const clientId = 'J5KOSFN0AD2FA2GU34NSY5YZKKTZH4QUDLROL5ORSIKWFODT';
const clientSecret = '15QIOXD4WYDHSNLKIVR5YHS0RHXDMMKYRVCQX01PF451DSPR';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const url2 = 'https://api.foursquare.com/v2/venues/43695300f964a5208c291fe3/photos?';

// OpenWeather Info
const openWeatherKey = 'ef53d0d9145b1e2d2bd963d5bf319a12';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// AJAX functions here:
const getVenues = async () => {
    const city = $input.val();
    const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200224`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
            return venues;
        }
    }
    catch (error) {
        console.log(error);
    }
}

const getForecast = async () => {
    const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
    } catch (error) {
        console.log(error);
    }
}

    // Render functions
    const renderVenues = (venues) => {
        $venueDivs.forEach(async ($venue, index) => {
            const venue = venues[index];
            const venueIcon = venue.categories[0].icon;
            const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
            let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
            $venue.append(venueContent);
        });
        $destination.append(`<h2>${venues[0].location.city}</h2>`);
    }

    const renderForecast = (day) => {
        let weatherContent = createWeatherHTML(day);
        $weatherDiv.append(weatherContent);
    }

    const executeSearch = () => {
        $venueDivs.forEach(venue => venue.empty());
        $weatherDiv.empty();
        $destination.empty();
        $container.css("visibility", "visible");
        getVenues().then(venues => renderVenues(venues));
        getForecast().then(forecast => renderForecast(forecast));
        return false;
    }


    $submit.click(executeSearch)