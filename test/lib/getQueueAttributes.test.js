import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import getQueueAttributes from '../../src/lib/getQueueAttributes';

const sandbox = sinon.createSandbox();

describe('getQueueAttributes', () => {
  const sqs = new SQS();
  const QueueUrl = 'https://queue.url';
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'getQueueAttributes').returns({
      promise: () => ({}),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof getQueueAttributes(sqs, QueueUrl)).toBe('function');
  });

  it('should call sqs.getQueueAttributes with correct parameters', async () => {
    await getQueueAttributes(sqs, QueueUrl)();
    sinon.assert.calledWith(mockSqs, { QueueUrl, AttributeNames: ['All'] });
  });
});
