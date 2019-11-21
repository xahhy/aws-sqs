import AWS from 'aws-sdk';

import sendMessage from './sendMessage';
import removeMessage from './removeMessage';
import receiveMessage from './receiveMessage';
import getQueueAttributes from './getQueueAttributes';
import getQueueUrl from './getQueueUrl';
import purgeQueue from './purgeQueue';

export default class SQS {
  constructor(QueueName, logger = console) {
    this.QueueName = QueueName;
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.logger = logger;
    this.type = String(QueueName).endsWith('.fifo') ? 'fifo' : 'standard';
  }

  async init() {
    this.QueueUrl = await getQueueUrl(this.sqs)(this.QueueName);
  }

  async sendMessage(message) {
    return sendMessage(this.sqs, this.QueueUrl)(message);
  }

  async removeMessage(message) {
    return removeMessage(this.sqs, this.QueueUrl)(message);
  }

  async receiveMessage(param) {
    return receiveMessage(this.sqs, this.QueueUrl)(param);
  }

  async purgeQueue() {
    return purgeQueue(this.sqs, this.QueueUrl)();
  }

  async getQueueAttributes() {
    return getQueueAttributes(this.sqs, this.QueueUrl)();
  }
}
