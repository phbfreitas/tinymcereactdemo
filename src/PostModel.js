const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    text: {
        type: String
    },

    blob: {
        data: Buffer,
        contentType: String
    }
});

module.exports = MasterPlan = mongoose.model('masterplan', PostSchema);