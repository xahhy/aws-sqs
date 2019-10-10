import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import purgeQueue from '../../src/lib/purgeQueue';

const sandbox = sinon.createSandbox();

describe('purgeQueue', () => {
  const sqs = new SQS();
  const QueueUrl = 'https://queue.url';
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'purgeQueue').returns({
      promise: () => ({}),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof purgeQueue(sqs, QueueUrl)).toBe('function');
  });

  it('should call sqs.purgeQueue with correct parameters', async () => {
    await purgeQueue(sqs, QueueUrl)();
    sinon.assert.calledWith(mockSqs, { QueueUrl });
  });
});
