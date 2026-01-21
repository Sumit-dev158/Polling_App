import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
});

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question for the poll']
    },
    options: {
        type: [optionSchema],
        validate: {
            validator: function (v) {
                return v.length >= 2;
            },
            message: 'A poll must have at least 2 options'
        }
    },
    voters: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
