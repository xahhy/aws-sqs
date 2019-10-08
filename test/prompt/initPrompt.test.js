import sinon from 'sinon';
import inquirer from 'inquirer';
import * as FIFOSQS from '../../src/lib/fifoSqs';
import * as SQS from '../../src/lib/sqs';
import initPrompt from '../../src/prompt/initPrompt';
import { MockFIFOSQS, MockSQS } from './fixtures';

const sandbox = sinon.createSandbox();

describe('initPrompt', () => {
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
