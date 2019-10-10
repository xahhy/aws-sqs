import sendFifoMessage from './sendFifoMessage';
import SQS from './sqs';

export default class FIFOSQS extends SQS {
  async sendMessage(message, MessageGroupId) {
    return sendFifoMessage(this.sqs, this.QueueUrl)(message, MessageGroupId);
  }
}
