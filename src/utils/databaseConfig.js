require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;


const connect = () => {
    mongoose.connect(mongoUri, {useNewUrlParser: true , useUnifiedTopology: true});
    const db = mongoose.connection;
    db.once('open', () => console.log('Database Connected'));
    db.on('error', (err) => {
        console.log(`Database error: ${err}`);
    });

}



module.exports = connect;