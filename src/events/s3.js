const AWS = require("aws-sdk");
AWS.config.update({region: process.env.AWS_REGION});
const { transformData, isRelevant } = require("../utils/transformation");
const { saveToDynamoDB } = require("../utils/dynamo");
const { sendNotification } = require("../utils/notification");

module.exports.processS3Event = async (event) => {
  console.log("Processing S3 Event:", JSON.stringify(event, null, 2));
  try {
    for (const record of event.Records) {
      const s3Object = record.s3.object;
      const s3 = new AWS.S3();
      const params = {
        Bucket: record.s3.bucket.name,
        Key: s3Object.key,
      };
      const data = await s3.getObject(params).promise();
      const logs = JSON.parse(data.Body.toString());

      if (Array.isArray(logs)) {
        for (const log of logs) {
          await processLog(log);
        }
      } else {
        await processLog(logs);
      }
    }
  } catch (error) {
    console.error("Error processing S3 event:", error);
    throw error;
  }
  return { message: "S3 Event processed successfully" };
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
    console.error("Error processing log:", error);
    throw error;
  }
}
