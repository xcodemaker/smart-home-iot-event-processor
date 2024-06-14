const AWS = require('aws-sdk-mock');
const { processS3Event } = require('../src/events/s3');

describe('S3 Event Processing', () => {
  beforeAll(() => {
    AWS.mock('S3', 'getObject', (params, callback) => {
      callback(null, { Body: JSON.stringify([{ device_id: 'device1', temperature: 25, humidity: 50, location: 'test_location' }]) });
    });
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {});
    });
    AWS.mock('SNS', 'publish', (params, callback) => {
      callback(null, {});
    });
  });

  afterAll(() => {
    AWS.restore('S3');
    AWS.restore('DynamoDB.DocumentClient');
    AWS.restore('SNS');
  });

  test('should process S3 event and save data to DynamoDB', async () => {
    const event = require('../config/s3-event.json');
    const result = await processS3Event(event);
    expect(result.message).toBe('S3 Event processed successfully');
  });
});
