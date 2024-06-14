const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function saveToDynamoDB(data) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: data
  };
  return dynamoDb.put(params).promise();
}

module.exports = {
  saveToDynamoDB
};
