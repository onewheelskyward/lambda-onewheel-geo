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

    console.log(event);
    var geocoder = NodeGeocoder(geocoderOptions);
    geocoder.geocode(event.queryStringParameters.text, function(err, res) {
        if (err || res.length == 0) {
            console.log("Error block");
            console.log(err);
            var response = {
                response_type: 'in_channel',
                text: "Unknown place " + event.queryStringParameters.text
            };
            superagent
                .post(event.queryStringParameters.response_url)
                .send(response)
                .set('Content-type', 'application/json')
                .end(function(err, res) {
                    console.log("Posted successfully!");
                    context.fail({
                        statusCode: 200,
                        headers: {},
                        body: "Unknown place " + event.queryStringParameters.text
                    });
                });

        } else {
            console.log("Success block");
            console.log(res);

            var response = {
                response_type: 'in_channel',
                text: res[0].latitude.toFixed(7) + ", " + res[0].longitude.toFixed(7) + "\n"
                + res[0].formattedAddress
            };
            console.log("Returning place: " + JSON.stringify(response));
            superagent
                .post(event.queryStringParameters.response_url)
                .send(response)
                .set('Content-type', 'application/json')
                .end(function(err, res) {
                    console.log("Posted successfully!");
                    context.succeed({
                        statusCode: 200,
                        headers: {},
                        body: JSON.stringify(response)
                    });
                });
        }
    });
};
