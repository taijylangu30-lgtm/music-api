const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/database');

async function startServer() {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`🚀 Music API Server démarré sur le port ${config.port}`);
  });
}

startServer();
