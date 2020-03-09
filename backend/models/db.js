const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://dice:'+ process.env.MONGO_DB_PW +'@cluster0-e5uxv.mongodb.net/test?retryWrites=true&w=majority';
require('./games');

mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected`);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('diconnected', () => {
    console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
      console.log(`Mongoose disconnected through ${msg}`);
      callback();
    });
  };

  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
      process.exit(0);
    });
  });
  process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
      process.exit(0);
    });
  });
