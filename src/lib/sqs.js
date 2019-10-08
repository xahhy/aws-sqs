import AWS from 'aws-sdk';

import prettyjson from 'prettyjson';
import sendMessage from './sendMessage';
import removeMessage from './removeMessage';
import receiveMessage from './receiveMessage';
import getQueueAttributes from './getQueueAttributes';
import getQueueUrl from './getQueueUrl';
import { tryCatchHelper } from './utils';
import purgeQueue from './purgeQueue';

export default class SQS {
  constructor(QueueName, logger = console) {
    AWS.config.update({ region: 'ap-southeast-2' });
    this.QueueName = QueueName;
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.logger = logger;
    this.tryCatchHelper = tryCatchHelper(logger);
    this.type = QueueName.endsWith('.fifo') ? 'fifo' : 'standard';
  }

  async init() {
    this.QueueUrl = await getQueueUrl(this.sqs)(this.QueueName);
  }

  async sendMessage(message) {
    return this.tryCatchHelper(async () => sendMessage(this.sqs, this.QueueUrl)(message));
  }

  async removeMessage(message) {
    return this.tryCatchHelper(async () => removeMessage(this.sqs, this.QueueUrl)(message));
  }

  async receiveMessage(param) {
    return this.tryCatchHelper(async () => receiveMessage(this.sqs, this.QueueUrl)(param));
  }

  async purgeQueue() {
    return this.tryCatchHelper(async () => purgeQueue(this.sqs, this.QueueUrl)());
  }

  async getQueueAttributes() {
    return this.tryCatchHelper(
      async () => getQueueAttributes(this.sqs, this.QueueUrl)(),
      (result) => {
        const { Attributes } = result;
        this.logger.log('Queue Attributes:\n', prettyjson.render(Attributes));
      },
    );
  }
}
