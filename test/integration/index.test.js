import sinon from 'sinon';
import inquirer from 'inquirer';
import assert from 'assert';
import { SQS } from 'aws-sdk';
import * as MySQS from '../../src/lib/sqs';
import * as MyFIFOSQS from '../../src/lib/fifoSqs';
import main from '../../src/main';
import * as loopPrompt from '../../src/prompt/loopPrompt';
import { ACTIONS } from '../../src/constants';
import fixtures from './fixtures';

const sandbox = sinon.createSandbox();

class MockSQS extends MySQS.default {}
class MockFIFOSQS extends MyFIFOSQS.default {}

describe('E2E integration', () => {
  const sqs = new SQS();
  beforeEach(() => {
    sandbox.stub(console, 'log');
    sandbox.stub(MySQS, 'default').callsFake(args => {
      const mockSqs = new MockSQS(args);
      mockSqs.sqs = sqs;
      return mockSqs;
    });
    sandbox.stub(MyFIFOSQS, 'default').callsFake(args => {
      const mockSqs = new MockFIFOSQS(args);
      mockSqs.sqs = sqs;
      return mockSqs;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when user type in QueueName', () => {
    let mockLoopPrompt;
    let mockConsole;
    beforeEach(() => {
      mockLoopPrompt = sandbox.stub(loopPrompt, 'default').throws(Error('Prevent infinite loop'));
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      mockConsole = sandbox.stub(console, 'error');
    });

    describe('and QueueName exist', () => {
      it('should start loop prompt', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'document' });
        sandbox.stub(sqs, 'getQueueUrl').returns({ promise: () => ({}) });
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.called(mockLoopPrompt);
      });
    });

    describe('and QueueName does not exist', () => {
      beforeEach(() => {
        sandbox
          .stub(inquirer, 'prompt')
          .onCall(0)
          .resolves({ QueueName: 'document' })
          .throws('Prevent infinite loop');
        sandbox.stub(sqs, 'getQueueUrl').returns({
          promise: sandbox
            .stub()
            .onCall(0)
            .throws(Error('Wrong QueueUrl'))
            .resolves({}),
        });
      });

      it('should not start loop prompt', async () => {
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.notCalled(mockLoopPrompt);
      });

      it('should log QueueUrl error', async () => {
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.calledWithMatch(
          mockConsole,
          sinon.match.instanceOf(Error).and(sinon.match.has('message', 'Wrong QueueUrl')),
        );
      });
    });
  });

  describe('when user select create message for a standard queue', () => {
    let mockInquirer;
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockSqs = sandbox.stub(sqs, 'sendMessage').returns({
        promise: () => ({}),
      });
      mockInquirer = sandbox
        .stub(inquirer, 'prompt')
        .onCall(0)
        .resolves({ QueueName: 'document' })
        .onCall(1)
        .resolves({ action: ACTIONS.CREATE_MESSAGE_ACTION });
    });

    describe('and user type in message', () => {
      it('should call sqs.sendMessage with message typed in', async () => {
        mockInquirer
          .onCall(2)
          .resolves({ message: 'my sqs message' })
          .throws(Error('prevent infinite loop'));
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.calledWith(mockSqs, {
          MessageBody: 'my sqs message',
          QueueUrl: fixtures.QUEUE_URL,
        });
      });
    });
  });

  describe('when user select create message for a fifo queue', () => {
    let mockInquirer;
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockSqs = sandbox.stub(sqs, 'sendMessage').returns({
        promise: () => ({}),
      });
      mockInquirer = sandbox
        .stub(inquirer, 'prompt')
        .onCall(0)
        .resolves({ QueueName: 'document.fifo' })
        .onCall(1)
        .resolves({ action: ACTIONS.CREATE_MESSAGE_ACTION });
    });

    describe('and user type in message', () => {
      it('should call sqs.sendMessage with message and GroupId typed in', async () => {
        mockInquirer
          .onCall(2)
          .resolves({ message: 'my sqs message', MessageGroupId: 'myGroupId' })
          .throws(Error('prevent infinite loop'));
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.calledWith(mockSqs, {
          MessageBody: 'my sqs message',
          MessageGroupId: 'myGroupId',
          QueueUrl: fixtures.QUEUE_URL,
        });
      });
    });
  });
});
