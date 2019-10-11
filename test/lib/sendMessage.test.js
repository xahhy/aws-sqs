import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import sendMessage from '../../src/lib/sendMessage';

const sandbox = sinon.createSandbox();

describe('sendMessage', () => {
  const sqs = new SQS();
  const QueueUrl = 'https://queue.url';
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'sendMessage').returns({
      promise: () => ({}),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof sendMessage(sqs, QueueUrl)).toBe('function');
  });

  describe('when message is a string', () => {
    it('should call sqs.sendMessage with string message', async () => {
      const message = 'message';
      const expectedParams = {
        MessageBody: 'message',
        QueueUrl,
      };
      await sendMessage(sqs, QueueUrl)(message);
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });

  describe('when message is a object', () => {
    it('should call sqs.sendMessage with stringified message', async () => {
      const message = { message: 'my sqs message' };
      const expectedParams = {
        MessageBody: '{"message":"my sqs message"}',
        QueueUrl,
      };
      await sendMessage(sqs, QueueUrl)(message);
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });
});
