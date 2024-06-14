const uuid = require("uuid");

function transformData(log) {
  const timestamp = new Date().toISOString();

  let airQualityIndex = log.air_quality_index;
  if (airQualityIndex === null || airQualityIndex === undefined) {
    airQualityIndex = calculateAirQualityIndex(log.pm2_5, log.pm10);
  }

  return {
    id: uuid.v4(),
    device_id: log.device_id || "unknown",
    timestamp: timestamp,
    temperature: log.temperature || null,
    humidity: log.humidity || null,
    air_quality_index: airQualityIndex,
    pm2_5: log.pm2_5 || null,
    pm10: log.pm10 || null,
    location: log.location || "unknown",
  };
}

function calculateAirQualityIndex(pm2_5, pm10) {
  if (
    pm2_5 === null ||
    pm2_5 === undefined ||
    pm10 === null ||
    pm10 === undefined
  ) {
    return 0;
  }

  const aqi = (pm2_5 + pm10) / 2;
  return Math.round(aqi);
}

function isRelevant(log) {
  return (
    log.temperature !== undefined ||
    log.humidity !== undefined ||
    log.air_quality_index !== undefined
  );
}

module.exports = {
  transformData,
  isRelevant,
};
