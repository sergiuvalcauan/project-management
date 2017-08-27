var mongoose = require('mongoose');


var taskSchema = mongoose.Schema({
    Summary: {type: String, required: true},
    Due_Date: {type: Date , default: ''},
    Status: {type: Number, default: ''},
    // User_id: {type: ObjectID, default: ''}
    User_id : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('Task', taskSchema, 'task' );
