import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import receiveMessage from '../../src/lib/receiveMessage';

const sandbox = sinon.createSandbox();

describe('receiveMessage', () => {
  const sqs = new SQS();
  const QueueUrl = 'https://queue.url';
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'receiveMessage').returns({
      promise: () => ({}),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof receiveMessage(sqs, QueueUrl)).toBe('function');
  });
  describe('when parameters passed', () => {
    it('should call sqs.receiveMessage with correct parameters passed', async () => {
      const params = {
        MaxNumberOfMessages: 2,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 1,
      };
      const expectedParams = {
        MaxNumberOfMessages: 2,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 1,
        QueueUrl,
        AttributeNames: ['All'],
      };
      await receiveMessage(sqs, QueueUrl)(params);
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });

  describe('when parameters not passed', () => {
    it('should call sqs.receiveMessage with default parameters', async () => {
      const expectedParams = {
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
        QueueUrl,
        AttributeNames: ['All'],
      };
      await receiveMessage(sqs, QueueUrl)();
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });
});
