import inquirer from 'inquirer';
import SQS from '../lib/sqs';
import FIFOSQS from '../lib/fifoSqs';

const initPrompt = async () => {
  const questions = [
    {
      type: 'input',
      name: 'QueueName',
      message: "What's Your Queue Name?",
      default: 'document',
    },
  ];
  const answer = await inquirer.prompt(questions);
  const queueName = answer.QueueName;
  let sqs;
  try {
    if (queueName.endsWith('fifo')) {
      sqs = new FIFOSQS(queueName);
    } else {
      sqs = new SQS(queueName);
    }
    await sqs.init();
    await sqs.getQueueAttributes();
  } catch (error) {
    console.error(error);
    sqs = await initPrompt();
  }
  return sqs;
};
export default initPrompt;
