var NodeGeocoder = require('node-geocoder');
var superagent = require('superagent');

exports.handler = function(event, context) {
    var geocoderOptions = {
        provider: 'google',
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };

    console.log(event.queryStringParameters);
    var geocoder = NodeGeocoder(geocoderOptions);
    var location = event.queryStringParameters.location;
    geocoder.geocode(location, function(err, res) {
        if (err || res.length == 0) {
            console.log("Error block");
            console.log(err);
                // text: "Unknown place " + location
        } else {
            console.log("Success block");
            console.log(res);
            response = {
                lat: res[0].latitude.toFixed(7),
                lng: res[0].longitude.toFixed(7),
                address: res[0].formattedAddress
            }
            console.log("Returning place: " + JSON.stringify(response));
            context.succeed({
                statusCode: 200,
                headers: {},
                body: JSON.stringify(response)
            });
        }
    });
};
