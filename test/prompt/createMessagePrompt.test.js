import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import createMessagePrompt from '../../src/prompt/createMessagePrompt';

const sandbox = sinon.createSandbox();

describe('purgeQueuePrompt', () => {
  let mockConsole;
  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when sqs type is standard', () => {
    it('should call sendMessage with message input', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ message: 'my sqs message' });
      const sqs = new SQS('document');
      const mockSqs = sinon.mock(sqs);
      mockSqs.expects('sendMessage').withArgs('my sqs message');

      await createMessagePrompt(sqs);

      mockSqs.verify();
      sinon.assert.calledWithMatch(mockConsole, 'Message Send Successfully');
    });
  });

  describe('when sqs type is fifo', () => {
    it('should not call sqs.purgeQueue', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ message: 'my sqs message', MessageGroupId: 'groupId' });
      const sqs = new SQS('document.fifo');
      const mockSqs = sinon.mock(sqs);
      mockSqs.expects('sendMessage').withArgs('my sqs message', 'groupId');

      await createMessagePrompt(sqs);

      mockSqs.verify();
      sinon.assert.calledWithMatch(mockConsole, 'Message Send Successfully');
    });
  });
});
