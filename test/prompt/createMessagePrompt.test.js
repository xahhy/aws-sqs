import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import createMessagePrompt from '../../src/prompt/createMessagePrompt';

const sandbox = sinon.createSandbox();

describe('createMessagePrompt', () => {
  let mockConsole;
  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when sqs type is standard', () => {
    let sqs;
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(inquirer, 'prompt').resolves({ message: 'my sqs message' });
      sqs = new SQS('document');
      mockSqs = sandbox.stub(sqs, 'sendMessage');
    });

    it('should call sendMessage with message input', async () => {
      await createMessagePrompt(sqs);
      sinon.assert.calledWith(mockSqs, 'my sqs message');
    });

    it('should log: Message Send Successfully', async () => {
      await createMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Message Send Successfully');
    });
  });

  describe('when sqs type is fifo', () => {
    let sqs;
    let mockSqs;
    beforeEach(() => {
      sandbox
        .stub(inquirer, 'prompt')
        .resolves({ message: 'my sqs message', MessageGroupId: 'groupId' });
      sqs = new SQS('document.fifo');
      mockSqs = sinon.stub(sqs, 'sendMessage');
    });

    it('should not call sqs.purgeQueue', async () => {
      await createMessagePrompt(sqs);
      sinon.assert.calledWith(mockSqs, 'my sqs message', 'groupId');
    });

    it('should log: Message Send Successfully', async () => {
      await createMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Message Send Successfully');
    });
  });
});
