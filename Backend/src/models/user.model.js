const mongo = require('mongoose');

const UserSchema = new mongo.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, {
    timestamps: true
});

const User = mongo.model("User", UserSchema);

module.exports = User;
















