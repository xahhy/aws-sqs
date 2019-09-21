import AWS from 'aws-sdk';

import prettyjson from 'prettyjson';
import chalk from 'chalk';
import sendMessage from './sendMessage';
import removeMessage from './removeMessage';
import receiveMessage from './receiveMessage';
import getQueueAttributes from './getQueueAttributes';
import getQueueUrl from './getQueueUrl';

const tryCatchHelper = (logger) => async (callback, afterCallback) => {
  let result;
  try {
    result = await callback();
    if (typeof afterCallback === 'function') {
      afterCallback(result);
    }
  } catch (error) {
    logger.error(error);
    result = error;
  }
  return result;
};
export default class SQS {
  constructor(QueueName, logger = console) {
    AWS.config.update({ region: 'ap-southeast-2' });
    this.QueueName = QueueName;
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.logger = logger;
    this.tryCatchHelper = tryCatchHelper(logger);
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
    return this.tryCatchHelper(
      async () => receiveMessage(this.sqs, this.QueueUrl)(param),
      (result) => {
        const { Messages } = result;
        this.logger.log('Poll Messages Success:\n', prettyjson.render(Messages));
        this.logger.log(chalk.green.bold(`Total Messages: ${Messages.length}`));
      },
    );
  }

  async getQueueAttributes() {
    return this.tryCatchHelper(
      async () => getQueueAttributes(this.sqs, this.QueueUrl)(),
      (result) => {
        const { Attributes } = result;
        console.log('Queue Attributes:\n', prettyjson.render(Attributes));
      },
    );
  }
}
