var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

var myBucket = 'cloudasspub';

var myKey = 'json.json.txt';

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     s3.getObject({
        Bucket: bucket,
        Key: key
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            console.log("Raw text:\n" + data.Body.toString('ascii'));
            callback(null, null);
        }
    });

   }

});

