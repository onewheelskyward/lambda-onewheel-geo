var superagent = require('superagent');

exports.handler = function(event, context) {
    console.log(event.queryStringParameters);
    var timestamp = Math.floor(Date.now() / 1000);
    var uri = 'https://maps.googleapis.com/maps/api/timezone/json?';

    uri += 'location=' + event.queryStringParameters.lat + ',' + event.queryStringParameters.lng;
    uri += '&timestamp=' + timestamp;
    uri += '&key=AIzaSyAlTbxqcZOlb3M-QXR4PCYpS2U1rfgwSlU';

    console.log(uri);

    superagent
        .get(uri)
        .end(function(err, res) {
            console.log("Body: " + JSON.stringify(res.body));
            if (res.body.status == "ZERO_RESULTS") {
                context.fail(JSON.stringify({
                    status: 400,
                    errors: [{
                        code: "400",
                        message: "Timezone for location not found."
                    }]
                }));
            } else {
                context.succeed({
                    statusCode: 200,
                    headers: {},
                    body: res.body.rawOffset / 3600
                });
            }
        });
};
