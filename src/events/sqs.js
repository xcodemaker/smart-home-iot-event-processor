const { transformData, isRelevant } = require('../utils/transformation');
const { saveToDynamoDB } = require('../utils/dynamo');
const { sendNotification } = require('../utils/notification');

module.exports.processSQSEvent = async (event) => {
  console.log('Processing SQS Event:', JSON.stringify(event, null, 2));
  try {
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      await processLog(messageBody);
    }
  } catch (error) {
    console.error('Error processing SQS event:', error);
    throw error;
  }
  return { message: 'SQS Event processed successfully' };
};

async function processLog(log) {
  try {
    if (isRelevant(log)) {
      const transformedData = transformData(log);
      await saveToDynamoDB(transformedData);
      
      if (transformedData.temperature > 30) {
        await sendNotification(transformedData);
      }
    }
  } catch (error) {
    console.error('Error processing log:', error);
    throw error;
  }
}
