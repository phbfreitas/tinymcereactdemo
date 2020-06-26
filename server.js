const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const MasterPlan = require('./src/PostModel');
const connectDB = require('./src/db');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const app = express();

// Init middleware
app.use(express.json({ extended: true, limit: '50mb' }));
//app.use(bodyParser.json);
//app.use(methodOverride('_method'));

// Connect DB
connectDB();
const mongoURI = "mongodb+srv://phbfreitas:peixe001@devconnector-xfktx.mongodb.net/test?retryWrites=true&w=majority";
const conn = mongoose.createConnection(mongoURI, { // this is for the gfs
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const BUCKET_NAME = 'test-bucket-master-plan-node-js';

const s3 = new AWS.S3();

app.get('/post/:post_id', async (req, res) => {
    try {

        const params = {
            Bucket: BUCKET_NAME,
            Key: req.params.post_id
        };
        console.log(BUCKET_NAME);
        console.log(req.params.post_id);

        // Downloading files from the bucket
        s3.getObject(params, (err, data) => {
            if (err) console.error(err);

            if (data) {
                const base64 = data.Body.toString('base64');
                // create a buffer
                const buff = Buffer.from(base64, 'base64');
                // decode buffer as UTF-8
                const str = buff.toString('utf-8');

                res.json({ blob: str });

            } else {
                res.json({ msg: `No key found for ${req.params.post_id}` });
            }
        });

        // const post = await MasterPlan.findById(req.params.post_id);

        // if (!post) {
        //     return res.status(404).json({ msg: `Post not found for: ${req.params.post_id}` });
        // }

        // res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: `Post not found for: ${req.params.post_id}` });
        }
        res.status(500).send('Server Error');
    }
});

// Define routes
//app.use('/api/post', require('./src/post'));

// app.post('/post', upload.single('blob'), async (req, res) => {
//     console.log('*********************req.body**********************');
//     console.log(req);
//     console.log('*********************req.body**********************');
//     res.json({ file: req.file });
/*     try {
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            text: req.body.text,
            blob: {
                data: (req.body.blob),
                contentType: 'blob'
            }
        }
 
        const post = new MasterPlan(newPost);
        await post.save();
 
        res.json({ message: 'New image added to the db!' });
    } catch (err) {
        //err.status(500).send('Server Error');
        console.error(err);
    }
 */
// });

app.post('/post', async (req, res) => {
    try {
        const buff = Buffer.from(req.body.formData.blob, 'utf-8');

        let fileNameId;
        const buf = crypto.randomBytes(16);
        fileNameId = buf.toString('hex');

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileNameId,
            Body: buff
        };

        // Uploading files to the bucket
        s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });

        res.json({ msg: `File uploaded successfully!!!` });
    } catch (err) {
        console.error(err);
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));