const AWS = require('aws-sdk');

const ID = 'AKIAJQ6MTFQSPIUKHWYA';
const SECRET = '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';

const BUCKET_NAME = 'test-bucket-master-plan-node-js';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "us-east-2"
    }
};

s3.createBucket(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});