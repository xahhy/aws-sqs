import sinon from 'sinon';
import SQS from '../../src/lib/sqs';
import getQueueAttributesPrompt from '../../src/prompt/getQueueAttributesPrompt';

const sandbox = sinon.createSandbox();

describe('getQueueAttributesPrompt', () => {
  let mockConsole;
  let mockSqs;
  const sqs = new SQS();

  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
    mockSqs = sandbox.stub(sqs, 'getQueueAttributes').resolves({
      Attributes: [],
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call sqs.getQueueAttributes', async () => {
    await getQueueAttributesPrompt(sqs);
    sinon.assert.calledOnce(mockSqs);
  });

  it('should log Queue Attributes:', async () => {
    await getQueueAttributesPrompt(sqs);
    sinon.assert.calledWithMatch(mockConsole, 'Queue Attributes:');
  });
});
