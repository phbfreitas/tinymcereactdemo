const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAJQ6MTFQSPIUKHWYA';
const SECRET = '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';

const BUCKET_NAME = 'test-bucket-master-plan-node-js';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile('./img/IMG_20191218_220308.jpg');