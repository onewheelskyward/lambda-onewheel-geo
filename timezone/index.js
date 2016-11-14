var superagent = require('superagent');

exports.handler = function(event, context) {
    console.log(event);
    var timestamp = Math.floor(Date.now() / 1000);
    var uri = 'https://maps.googleapis.com/maps/api/timezone/json?';

    uri += 'location=45,-122';
    uri += '&timestamp=' + timestamp;
    uri += '&key=AIzaSyAlTbxqcZOlb3M-QXR4PCYpS2U1rfgwSlU';

    console.log(uri);

    superagent
        .get(uri)
        .end(function(err, res) {
            console.log(res.body);
            context.succeed({
                statusCode: 200,
                headers: {},
                body: res.body.rawOffset / 3600
            });
        });
};
