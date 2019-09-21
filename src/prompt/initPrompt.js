import inquirer from 'inquirer';
import SQS from '../lib/sqs';

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
  let sqs;
  try {
    sqs = new SQS(answer.QueueName);
    await sqs.init();
    await sqs.getQueueAttributes();
  } catch (error) {
    console.error(error);
    sqs = await initPrompt();
  }
  return sqs;
};
export default initPrompt;
