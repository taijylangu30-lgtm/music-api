const Stats = require('../models/Stats');

module.exports = {
  logStat: async (type, data = {}) => {
    try {
      if (!Stats.db.readyState) return;
      await Stats.create({ type, ...data });
    } catch (e) {
      // Éviter les erreurs bloquantes pour l'API si la DB échoue
      console.warn('Erreur enregistrement stats:', e.message);
    }
  }
};
