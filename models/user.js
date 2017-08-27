var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: ''},
    company: { type: String, default: ''},

    // tasks: [Schema.Types.ObjectId],
    // projects: [Schema.Types.ObjectId],  ? sau
    // tasks : [{
    //     id : Schema.Types.ObjectId,
    //     name : String
    // }]

    tasks : [{
        id : {type: mongoose.Schema.Types.ObjectId , ref: 'Task'},
        name : String
    }],
    projects : [{
        id : {type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        name : String
    }],

    passwordResetToken: {type: String, default: ''},
    passwordResetExpires: {type: Date, default: Date.now},
    tokens: Array
});

// userSchema.methods.encryptPassword = function(password)  {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// }
//
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

userSchema.methods.validPassword = function(password) {
    return ( password < this.password ? -1 : ( password > this.password ? 0 : 1 ) );
};


module.exports = mongoose.model('User', userSchema, 'users');



/*
 db.users.update({_id: ObjectId("58d6761e6d7a95f86961484e")},
 { $set:
 { tasks: [{ id: ObjectId("58d6783a6d7a95f869614872"), name : "leverage end-to-end methodologies"},{id: ObjectId("58d6783a6d7a95f869614873"), name:"visualize scalable partnerships" } ]
 }
 });
 */
