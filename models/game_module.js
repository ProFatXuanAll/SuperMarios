const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
    account: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const playerSchema = new mongoose.Schema({
    playerType: {
        type: String,
        unique: true,
        index: true,
        required: true
    }
});

const monsterSchema = new mongoose.Schema({
    monsterType: {
        type: String,
        unique: true,
        index: true,
        required: true
    }
});

const gameModel = {
    user: mongoose.model('user', userSchema),
    player: mongoose.model('player', playerSchema),
    monster: mongoose.model('monster', monsterSchema)
}

module.exports = gameModel;