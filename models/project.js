var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Client: {type: String, required: true},
    Tasks: {type: Number , default: ''},
    Messages: {type: Number, default: ''},
    Files: {type: Number, default: ''},
    Progress: {type: Number, default: ''},

    // tasks: [Schema.Types.ObjectId],
    // users: [Schema.Types.ObjectId]

    tasks : [{
        id : {type: mongoose.Schema.Types.ObjectId , ref: 'Task'},
        name : String
    }],

    users : [{
        id : {type: mongoose.Schema.Types.ObjectId , ref: 'Task'},
        name : String
    }]
});


module.exports = mongoose.model('Project', projectSchema, 'project');
