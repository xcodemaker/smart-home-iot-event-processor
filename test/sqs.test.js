const AWS = require('aws-sdk-mock');
const { processSQSEvent } = require('../src/events/sqs');

describe('SQS Event Processing', () => {
  beforeAll(() => {
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {});
    });
    AWS.mock('SNS', 'publish', (params, callback) => {
      callback(null, {});
    });
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
    AWS.restore('SNS');
  });

  test('should process SQS event and save data to DynamoDB', async () => {
    const event = require('../config/sqs-event.json');
    const result = await processSQSEvent(event);
    expect(result.message).toBe('SQS Event processed successfully');
  });
});
