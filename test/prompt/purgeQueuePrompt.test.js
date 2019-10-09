import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import purgeQueuePrompt from '../../src/prompt/purgeQueuePrompt';

const sandbox = sinon.createSandbox();

describe('purgeQueuePrompt', () => {
  let mockConsole;
  let mockSqs;
  const sqs = new SQS();

  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
    mockSqs = sandbox.stub(sqs, 'purgeQueue');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when confirm purgeQueue yes', () => {
    it('should call sqs.purgeQueue', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ isPurgeQueue: true });

      await purgeQueuePrompt(sqs);

      sinon.assert.calledOnce(mockSqs);
      sinon.assert.calledWithMatch(mockConsole, 'Queue Purged In Progress');
    });
  });

  describe('when confirm purgeQueue no', () => {
    it('should not call sqs.purgeQueue', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ isPurgeQueue: false });

      await purgeQueuePrompt(sqs);

      sinon.assert.notCalled(mockSqs);
      sinon.assert.notCalled(mockConsole);
    });
  });
});
