import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import removeMessagePrompt from '../../src/prompt/removeMessagePrompt';

const sandbox = sinon.createSandbox();

describe('purgeQueuePrompt', () => {
  let mockConsole;
  let mockSqs;
  const sqs = new SQS();

  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'log');
    mockSqs = sandbox.stub(sqs, 'removeMessage').resolves('Remove Message Successful');
    sandbox.stub(inquirer, 'prompt').resolves({ ReceiptHandle: '123' });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when input ReceiptHandle of message', () => {
    it('should call sqs.removeMessage', async () => {
      await removeMessagePrompt(sqs);

      sinon.assert.calledWith(mockSqs, { ReceiptHandle: '123' });
    });

    it('should log sqs.removeMessage return value', async () => {
      await removeMessagePrompt(sqs);

      sinon.assert.calledWith(mockSqs, { ReceiptHandle: '123' });
      sinon.assert.calledWithMatch(mockConsole, 'Remove Message Successful');
    });
  });
});
