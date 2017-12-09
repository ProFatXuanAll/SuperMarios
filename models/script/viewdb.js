const config = require('../../config');
const model = require('../game_model');
const mongoose = require('mongoose');

const url = `mongodb://${config.mongo.user}:${config.mongo.password}@localhost:27017/${config.mongo.dbname}`

mongoose.connect(url, { useMongoClient: true }, (err, res) => {
  if (err) console.log('MongoDB connected failed');
  else console.log('MongoDB connected success');
});
mongoose.Promise = global.Promise;

model.user.find({},function(err,result){
    if(err) console.log("remove error");
    else console.log(result);
});
