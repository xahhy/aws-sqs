import sinon from 'sinon';
import inquirer from 'inquirer';
import SQS from '../../src/lib/sqs';
import loopPrompt from '../../src/prompt/loopPrompt';
import * as createMessagePrompt from '../../src/prompt/createMessagePrompt';
import * as receiveMessagePrompt from '../../src/prompt/receiveMessagePrompt';
import * as removeMessagePrompt from '../../src/prompt/removeMessagePrompt';
import * as purgeQueuePrompt from '../../src/prompt/purgeQueuePrompt';
import { ACTIONS } from '../../src/constants';

const sandbox = sinon.createSandbox();

describe('loopPrompt', () => {
  let mockCreateMessagePrompt;
  let mockReceiveMessagePrompt;
  let mockRemoveMessagePrompt;
  let mockPurgeQueuePrompt;
  let mockConsole;
  let mockSqs;
  const sqs = new SQS();

  beforeEach(() => {
    mockConsole = sandbox.stub(console, 'error');
    mockSqs = sandbox.stub(sqs, 'getQueueAttributes');
    mockCreateMessagePrompt = sandbox.stub(createMessagePrompt, 'default');
    mockReceiveMessagePrompt = sandbox.stub(receiveMessagePrompt, 'default');
    mockRemoveMessagePrompt = sandbox.stub(removeMessagePrompt, 'default');
    mockPurgeQueuePrompt = sandbox.stub(purgeQueuePrompt, 'default');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when action is createMessage', () => {
    it('should call createMessagePrompt', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.CREATE_MESSAGE_ACTION });

      await loopPrompt(sqs);

      sinon.assert.calledOnce(mockCreateMessagePrompt);
    });

    describe('and action throw error', () => {
      it('should log error', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.CREATE_MESSAGE_ACTION });
        mockCreateMessagePrompt.throws(Error('some error'));

        await loopPrompt(sqs);

        sinon.assert.calledWith(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'some error')),
        );
      });
    });
  });

  describe('when action is receiveMessage', () => {
    it('should call receiveMessagePrompt', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.PULL_MESSAGE_ACTION });

      await loopPrompt(sqs);

      sinon.assert.calledOnce(mockReceiveMessagePrompt);
    });

    describe('and action throw error', () => {
      it('should log error', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.PULL_MESSAGE_ACTION });
        mockReceiveMessagePrompt.throws(Error('some error'));

        await loopPrompt(sqs);

        sinon.assert.calledWith(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'some error')),
        );
      });
    });
  });


  describe('when action is removeMessage', () => {
    it('should call removeMessagePrompt', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.REMOVE_MESSAGE_ACTION });

      await loopPrompt(sqs);

      sinon.assert.calledOnce(mockRemoveMessagePrompt);
    });

    describe('and action throw error', () => {
      it('should log error', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.REMOVE_MESSAGE_ACTION });
        mockRemoveMessagePrompt.throws(Error('some error'));

        await loopPrompt(sqs);

        sinon.assert.calledWith(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'some error')),
        );
      });
    });
  });

  describe('when action is pureQueue', () => {
    it('should call pureQueuePrompt', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.PURE_QUEUE_ACTION });

      await loopPrompt(sqs);

      sinon.assert.calledOnce(mockPurgeQueuePrompt);
    });

    describe('and action throw error', () => {
      it('should log error', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.PURE_QUEUE_ACTION });
        mockPurgeQueuePrompt.throws(Error('some error'));

        await loopPrompt(sqs);

        sinon.assert.calledWith(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'some error')),
        );
      });
    });
  });

  describe('when action is getQueueAttributes', () => {
    it('should call sqs.getQueueAttributes', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.GET_QUEUE_ATTRIBUTES_ACTION });

      await loopPrompt(sqs);

      sinon.assert.calledOnce(mockSqs);
    });

    describe('and action throw error', () => {
      it('should log error', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ action: ACTIONS.GET_QUEUE_ATTRIBUTES_ACTION });
        mockSqs.throws(Error('some error'));

        await loopPrompt(sqs);

        sinon.assert.calledWith(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'some error')),
        );
      });
    });
  });
});
