import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import purgeQueuePrompt from '../../src/prompt/purgeQueuePrompt';

const sandbox = sinon.createSandbox();

describe('purgeQueuePrompt', () => {
  let mockConsole;
  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when confirm purgeQueue yes', () => {
    it('should call sqs.purgeQueue', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ isPurgeQueue: true });
      const sqs = new SQS();
      const mockSqs = sinon.mock(sqs);
      mockSqs.expects('purgeQueue').once();

      await purgeQueuePrompt(sqs);

      mockSqs.verify();
      sinon.assert.calledWithMatch(mockConsole, 'Queue Purged In Progress');
    });
  });

  describe('when confirm purgeQueue no', () => {
    it('should not call sqs.purgeQueue', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ isPurgeQueue: false });
      const sqs = new SQS();
      const mockSqs = sinon.mock(sqs);
      mockSqs.expects('purgeQueue').never();

      await purgeQueuePrompt(sqs);

      mockSqs.verify();
      sinon.assert.notCalled(mockConsole);
    });
  });
});
