import { SQS } from 'aws-sdk';
import sinon from 'sinon';
import getQueueUrl from '../../src/lib/getQueueUrl';

const sandbox = sinon.createSandbox();

describe('getQueueUrl', () => {
  const sqs = new SQS();
  let mockSqs;
  beforeEach(() => {
    mockSqs = sandbox.stub(sqs, 'getQueueUrl').returns({
      promise: () => ({ QueueUrl: 'https://queueUrl' }),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a curry function', () => {
    expect(typeof getQueueUrl(sqs)).toBe('function');
  });

  it('should call sqs.getQueueUrl with QueueName passed', async () => {
    await getQueueUrl(sqs)('QueueName');
    sinon.assert.calledWith(mockSqs, { QueueName: 'QueueName' });
  });
});
