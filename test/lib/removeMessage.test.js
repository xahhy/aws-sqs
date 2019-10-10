import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import removeMessage from '../../src/lib/removeMessage';

const sandbox = sinon.createSandbox();

describe('removeMessage', () => {
  const sqs = new SQS();
  const QueueUrl = 'https://queue.url';
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'deleteMessage').returns({
      promise: () => ({}),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof removeMessage(sqs, QueueUrl)).toBe('function');
  });

  it('should call sqs.deleteMessage with correct parameters', async () => {
    const message = {
      ReceiptHandle: 'xxx',
    };
    const expectedParams = {
      QueueUrl,
      ReceiptHandle: 'xxx',
    };
    await removeMessage(sqs, QueueUrl)(message);
    sinon.assert.calledWith(mockSqs, expectedParams);
  });
});
