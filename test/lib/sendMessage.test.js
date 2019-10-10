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
      promise: () => ({ }),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof sendMessage(sqs, QueueUrl)).toBe('function');
  });

  it('should call sqs.sendMessage with correct parameters', async () => {
    const message = 'message';
    const expectedParams = {
      MessageBody: JSON.stringify(message),
      QueueUrl,
    };
    await sendMessage(sqs, QueueUrl)(message);
    sinon.assert.calledWith(mockSqs, expectedParams);
  });
});
