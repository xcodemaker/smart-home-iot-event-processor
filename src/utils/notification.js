const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const sns = new AWS.SNS();

async function sendNotification(data) {
  const params = {
    Message: `High temperature alert! Device: ${data.device_id}, Temperature: ${data.temperature}, Location: ${data.location}`,
    TopicArn: process.env.SNS_TOPIC_ARN
  };
  return sns.publish(params).promise();
}

module.exports = {
  sendNotification
};
