const uuid = require('uuid');

function transformData(log) {
  const timestamp = new Date().toISOString();
  return {
    id: uuid.v4(),
    device_id: log.device_id || 'unknown',
    timestamp: timestamp,
    temperature: log.temperature || null,
    humidity: log.humidity || null,
    air_quality_index: log.air_quality_index || null,
    pm2_5: log.pm2_5 || null,
    pm10: log.pm10 || null,
    location: log.location || 'unknown'
  };
}

function isRelevant(log) {
  return log.temperature !== undefined || log.humidity !== undefined || log.air_quality_index !== undefined;
}

module.exports = {
  transformData,
  isRelevant
};
