const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      console.warn('⚠️ MONGODB_URI non définie. Le stockage de la base de données est désactivé.');
      return;
    }
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connexion MongoDB réussie.');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
  }
};

module.exports = connectDB;
