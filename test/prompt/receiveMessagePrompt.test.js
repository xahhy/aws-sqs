import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import receiveMessagePrompt from '../../src/prompt/receiveMessagePrompt';

const sandbox = sinon.createSandbox();

describe('receiveMessagePrompt', () => {
  let mockConsole;
  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when pull 1 message', () => {
    let sqs;
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(inquirer, 'prompt')
        .resolves({ MaxNumberOfMessages: 1, VisibilityTimeout: 10, WaitTimeSeconds: 10 });
      sqs = new SQS('document');
      mockSqs = sandbox.stub(sqs, 'receiveMessage').resolves({ Messages: ['message1'] });
    });

    it('should call receiveMessage', async () => {
      await receiveMessagePrompt(sqs);
      sinon.assert.calledWith(mockSqs, { MaxNumberOfMessages: 1, VisibilityTimeout: 10, WaitTimeSeconds: 10 });
    });

    it('should log: Poll Messages Success', async () => {
      await receiveMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Poll Messages Success');
    });

    it('should log: Total Messages: 1', async () => {
      await receiveMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Total Messages: 1');
    });
  });

  describe('when pull 2 messages', () => {
    let sqs;
    beforeEach(() => {
      sandbox.stub(inquirer, 'prompt')
        .resolves({ MaxNumberOfMessages: 1, VisibilityTimeout: 10, WaitTimeSeconds: 10 });
      sqs = new SQS('document');
      sandbox.stub(sqs, 'receiveMessage').resolves({ Messages: ['message1', 'message2'] });
    });

    it('should log: Total Messages: 2', async () => {
      await receiveMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Total Messages: 2');
    });
  });

  describe('when no message pulled', () => {
    let sqs;
    beforeEach(() => {
      sandbox.stub(inquirer, 'prompt')
        .resolves({ MaxNumberOfMessages: 1, VisibilityTimeout: 10, WaitTimeSeconds: 10 });
      sqs = new SQS('document');
      sandbox.stub(sqs, 'receiveMessage').resolves({});
    });

    it('should log: Sorry. No message available', async () => {
      await receiveMessagePrompt(sqs);
      sinon.assert.calledWithMatch(mockConsole, 'Sorry. No message available');
    });
  });
});
