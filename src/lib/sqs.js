import AWS from 'aws-sdk';

import prettyjson from 'prettyjson';
import chalk from 'chalk';
import emoji from 'node-emoji';
import sendMessage from './sendMessage';
import removeMessage from './removeMessage';
import receiveMessage from './receiveMessage';
import getQueueAttributes from './getQueueAttributes';
import getQueueUrl from './getQueueUrl';
import { tryCatchHelper } from './utils';

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
        if (Messages) {
          this.logger.log(
            'Poll Messages Success:\n',
            prettyjson.render(Messages),
          );
          this.logger.log(
            emoji.emojify(`:white_check_mark:  ${chalk.green.bold(`Total Messages: ${Messages.length}`)}`),
          );
        } else {
          this.logger.log(emoji.emojify(`:exclamation:  ${chalk.bold.red('Sorry. No message available')}`));
        }
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
