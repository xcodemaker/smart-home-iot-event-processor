const { processS3Event } = require('./src/events/s3');
const { processSQSEvent } = require('./src/events/sqs');

module.exports = {
  processS3Event,
  processSQSEvent
};
