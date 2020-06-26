const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAJQ6MTFQSPIUKHWYA';
const SECRET = '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';

const BUCKET_NAME = 'test-bucket-master-plan-node-js';

const filePath = './img/picture.jpg';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const downloadFile = (filePath) => {

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg' // File name you want to read from S3
    };

    // Downloading files from the bucket
    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(filePath, data.Body);
        console.log(`${filePath} has been created!`);
    });


};

downloadFile(filePath);