const mongoose  = require("mongoose");

const AppDataSchema = new mongoose.Schema({
    autonumber: {type: Number, required: true}
});

module.exports = mongoose.model('AppData', AppDataSchema);