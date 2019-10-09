import sinon from 'sinon';
import inquirer from 'inquirer';
import * as FIFOSQS from '../../src/lib/fifoSqs';
import * as SQS from '../../src/lib/sqs';
import initPrompt from '../../src/prompt/initPrompt';
import { MockFIFOSQS, MockSQS, MockSQSThrowError } from './fixtures';

const sandbox = sinon.createSandbox();

describe('initPrompt', () => {
  describe('when sqs init successfully', () => {
    beforeEach(() => {
      sandbox.stub(FIFOSQS, 'default').callsFake((args) => new MockFIFOSQS(args));
      sandbox.stub(SQS, 'default').callsFake((args) => new MockSQS(args));
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('when QueueName is document.fifo which ends with .fifo', () => {
      it('should return fifo queue instance', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'document.fifo' });
        const result = await initPrompt();
        expect(result.type).toBe('fifo');
      });
    });

    describe('when QueueName is documentfifo which is not ends with .fifo', () => {
      it('should return standard queue instance', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'documentfifo' });
        const result = await initPrompt();
        expect(result.type).toBe('standard');
      });
    });

    describe('when QueueName is document which is not ends with .fifo', () => {
      it('should return a standard queue instance', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'document' });
        const result = await initPrompt();
        expect(result.type).toBe('standard');
      });
    });
  });
  
  describe('when error happens during sqs init', () => {
    let mockSqs;
    let mockConsole;
    beforeEach(() => {
      mockSqs = sandbox.stub(SQS, 'default')
        .onCall(0)
        .callsFake((args) => new MockSQSThrowError(args))
        .callsFake((args) => new MockSQS(args));
      mockConsole = sandbox.stub(console, 'error');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should call initPrompt again', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'document' });
      const result = await initPrompt();
      expect(result.type).toBe('standard');
      sinon.assert.calledTwice(mockSqs);
    });

    it('should log error', async () => {
      sandbox.stub(inquirer, 'prompt').resolves({ QueueName: 'document' });
      await initPrompt();
      sinon.assert.calledWith(
        mockConsole,
        sinon.match.instanceOf(Error).and(sinon.match.has('message', 'init error')),
      );
    });
  });
});
