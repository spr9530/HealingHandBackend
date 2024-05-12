const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userInfoSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    problem: [
        {
            type: String,
            required: true,
        }
    ],
    message: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: 'No notes available',
    },
    read: {
        type: String,
        default: 'unread',
    },
    time: {
        type: String,
    }
},
    {
        timestamps: true 
    }
)

const UserInfo = mongoose.model('UserInfo', userInfoSchema)

module.exports = UserInfo