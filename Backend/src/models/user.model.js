const mongo = require('mongoose');

const UserSchema = new mongo.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

}, {
    timestamps: true
});

const User = mongo.model("User", UserSchema);

// const CreatUser = async ()=>{
//     const CUser = await User.create({
//         fullName: 'Abdallah Faheem',
//         phone: '00962788688925',
//         password: 'Ar2001131711',
//         role: 'admin'
//     });
// }
// CreatUser();

module.exports = User;
