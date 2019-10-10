import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import sendFifoMessage from '../../src/lib/sendFifoMessage';
import { mockDate } from '../setup';

const sandbox = sinon.createSandbox();

describe('sendFifoMessage', () => {
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
    expect(typeof sendFifoMessage(sqs, QueueUrl)).toBe('function');
  });

  describe('when message and MessageGroupId passed', () => {
    it('should call sqs.sendMessage with correct parameters', async () => {
      const message = 'message';
      const MessageGroupId = 'message group id';
      const expectedParams = {
        MessageBody: JSON.stringify(message),
        QueueUrl,
        MessageGroupId,
      };
      await sendFifoMessage(sqs, QueueUrl)(message, MessageGroupId);
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });

  describe('when message and MessageGroupId not passed', () => {
    it('should call sqs.sendMessage with default MessageGroupId as current timestamp', async () => {
      const message = 'message';
      const expectedParams = {
        MessageBody: JSON.stringify(message),
        QueueUrl,
        MessageGroupId: mockDate.toISOString(),
      };
      await sendFifoMessage(sqs, QueueUrl)(message);
      sinon.assert.calledWith(mockSqs, expectedParams);
    });
  });
});
