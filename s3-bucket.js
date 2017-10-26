var AWS = require('aws-sdk');
var PubNub = require('pubnub');

pubnub = new PubNub({
        publishKey : 'pub-c-d11135a3-2b45-4b82-aaa8-019acb4f6377',
        subscribeKey : 'sub-c-fab87fa4-b8e5-11e7-a84a-1e64a053e7fc'
    })

var s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

var bucket = 'cloudasspub';

var key = 'json.txt';

s3.createBucket({Bucket: bucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     s3.getObject({
        Bucket: bucket,
        Key: key
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
			publishFile(data.Body.toString('ascii'));
            console.log("Raw text:\n" + data.Body.toString('ascii'));
        }
    });

   }

});

function publishFile(message) {
	console.log("Publishing s3 file contents to pubnub");
	var publishConfig = {
		channel : "greet",
		message : message
	}
	pubnub.publish(publishConfig, function(status, response) {
		console.log(status, response);
	})
}

