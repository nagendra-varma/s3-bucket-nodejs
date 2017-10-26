var AWS = require('aws-sdk');
var PubNub = require('pubnub');

pubnub = new PubNub({
        publishKey : 'pub-c-d11135a3-2b45-4b82-aaa8-019acb4f6377',
        subscribeKey : 'sub-c-fab87fa4-b8e5-11e7-a84a-1e64a053e7fc',
		secretKey: 'sec-c-YTU1ZTZjNDYtYjY0MC00NGZiLWE1ZjUtOTI0ZGI2ZDRlOGI1'
    });

subscribe();
grantForPublishingIntoChannel();

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

function subscribe() {
	pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("Listening to pubnub");
            }
        },
        message: function(message) {
            console.log("New Message!!", message);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })      
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['greet'] 
    });
}

function grantForPublishingIntoChannel() {
	pubnub.grant(
    {
        channels: ["greet"],
        read: true,
        write: true
    },
    function (status) {
        console.log("pubnub grant status : ", status);
    }
);
}

function publishFile(message) {
	console.log("Publishing s3 file contents to pubnub");
	var publishConfig = {
		// channel name : Channel-yqpl1sc3u
		channel : "greet",
		message : message
	}
	pubnub.publish(publishConfig, function(status, response) {
		console.log(status, response);
	})
}

