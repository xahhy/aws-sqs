import sinon from 'sinon';
import inquirer from 'inquirer';
import assert from 'assert';
import { SQS } from 'aws-sdk';
import { stdin } from 'mock-stdin';
import { promisify } from 'util';
import * as MySQS from '../../src/lib/sqs';
import * as MyFIFOSQS from '../../src/lib/fifoSqs';
import main from '../../src/main';
import * as loopPrompt from '../../src/prompt/loopPrompt';
import fixtures from './fixtures';
import { ACTIONS } from '../../src/constants';

const sandbox = sinon.createSandbox();

const sleep = promisify(setTimeout);
const KEYS = {
  up: '\x1B\x5B\x41',
  down: '\x1B\x5B\x42',
  enter: '\x0D',
  space: '\x20',
};
const INPUT_TRIGGER_DELAY_TIME = 500;
const PROMPT_DELAY_TIME = 100;

class MockSQS extends MySQS.default {}
class MockFIFOSQS extends MyFIFOSQS.default {}

describe('E2E integration', () => {
  const sqs = new SQS();
  let io;
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
    io = stdin();
  });

  afterEach(() => {
    sandbox.restore();
    io.restore();
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
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockSqs = sandbox.stub(sqs, 'sendMessage').returns({
        promise: () => ({}),
      });
    });

    describe('and user type in message', () => {
      it('should call sqs.sendMessage with message typed in', async () => {
        const sendKeystrokes = async () => {
          io.send('document');
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Select Create Message
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Type in message
          io.send('my sqs message');
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Quit
          io.send(KEYS.up);
          io.send(KEYS.enter);
        };
        setTimeout(() => sendKeystrokes().then(), INPUT_TRIGGER_DELAY_TIME);
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
    let mockSqs;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockSqs = sandbox.stub(sqs, 'sendMessage').returns({
        promise: () => ({}),
      });
    });

    describe('and user type in message', () => {
      it('should call sqs.sendMessage with message and GroupId typed in', async () => {
        const sendKeystrokes = async () => {
          io.send('document.fifo');
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Select Create Message
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Type in message
          io.send('my sqs message');
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Type in MessageGroupId
          io.send('myGroupId');
          io.send(KEYS.enter);
          await sleep(PROMPT_DELAY_TIME);
          // Quit
          io.send(KEYS.up);
          io.send(KEYS.enter);
        };
        setTimeout(() => sendKeystrokes().then(), INPUT_TRIGGER_DELAY_TIME);
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

  describe('when user select receive message', () => {
    let mockInquirer;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockInquirer = sandbox
        .stub(inquirer, 'prompt')
        .onCall(0)
        .resolves({ QueueName: 'document' })
        .onCall(1)
        .resolves({ action: ACTIONS.PULL_MESSAGE_ACTION });
    });

    describe('and user type in receive message parameters', () => {
      it('should call sqs.receiveMessage with correct parameters', async () => {
        mockInquirer
          .onCall(2)
          .resolves({
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 10,
            WaitTimeSeconds: 10,
            QueueUrl: fixtures.QUEUE_URL,
            AttributeNames: ['All'],
          })
          .onCall(3)
          .resolves({ action: ACTIONS.QUIT });
        const mockSqs = sandbox.stub(sqs, 'receiveMessage').returns({
          promise: () => ({}),
        });
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.calledWith(mockSqs, {
          MaxNumberOfMessages: 1,
          VisibilityTimeout: 10,
          WaitTimeSeconds: 10,
          QueueUrl: fixtures.QUEUE_URL,
          AttributeNames: ['All'],
        });
      });
    });
  });

  describe('when user select purge queue', () => {
    let mockInquirer;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockInquirer = sandbox
        .stub(inquirer, 'prompt')
        .onCall(0)
        .resolves({ QueueName: 'document' })
        .onCall(1)
        .resolves({ action: ACTIONS.PURE_QUEUE_ACTION });
    });

    describe('and user type yes', () => {
      it('should call sqs.purgeQueue', async () => {
        mockInquirer
          .onCall(2)
          .resolves({ isPurgeQueue: true })
          .onCall(3)
          .resolves({ action: ACTIONS.QUIT });
        const mockSqs = sandbox.stub(sqs, 'purgeQueue').returns({
          promise: () => ({}),
        });
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.called(mockSqs);
      });
    });

    describe('and user type no', () => {
      it('should call sqs.purgeQueue', async () => {
        mockInquirer
          .onCall(2)
          .resolves({ isPurgeQueue: false })
          .onCall(3)
          .resolves({ action: ACTIONS.QUIT });
        const mockSqs = sandbox.stub(sqs, 'purgeQueue').returns({
          promise: () => ({}),
        });
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.notCalled(mockSqs);
      });
    });
  });

  describe('when user select remove message', () => {
    let mockInquirer;
    beforeEach(() => {
      sandbox.stub(sqs, 'getQueueAttributes').returns({ promise: () => ({}) });
      sandbox
        .stub(sqs, 'getQueueUrl')
        .returns({ promise: () => ({ QueueUrl: fixtures.QUEUE_URL }) });
      mockInquirer = sandbox
        .stub(inquirer, 'prompt')
        .onCall(0)
        .resolves({ QueueName: 'document' })
        .onCall(1)
        .resolves({ action: ACTIONS.REMOVE_MESSAGE_ACTION });
    });

    describe('and user type in message handle', () => {
      it('should call sqs.deleteMessage with correct parameters', async () => {
        mockInquirer
          .onCall(2)
          .resolves({
            ReceiptHandle: 'xxx',
          })
          .onCall(3)
          .resolves({ action: ACTIONS.QUIT });
        const mockSqs = sandbox.stub(sqs, 'deleteMessage').returns({
          promise: () => ({}),
        });
        try {
          await main();
        } catch (e) {
          assert(true);
        }
        sinon.assert.calledWith(mockSqs, {
          QueueUrl: fixtures.QUEUE_URL,
          ReceiptHandle: 'xxx',
        });
      });
    });
  });
});
