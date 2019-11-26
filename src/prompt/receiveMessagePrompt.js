import inquirer from 'inquirer';
import prettyjson from 'prettyjson';
import emoji from 'node-emoji';
import chalk from 'chalk';
import { validateNumber } from '../utils';

export default async sqs => {
  const DEFAULT_MAX_NUMBER_OF_MESSAGES = 1;
  const DEFAULT_WAIT_TIME_SECONDS = 10;
  const DEFAULT_VISIBILITY_TIMEOUT = 2;
  const questions = [
    {
      type: 'input',
      name: 'MaxNumberOfMessages',
      message:
        "What's the maximum number of messages you want to return? (MaxNumberOfMessages)",
      default: DEFAULT_MAX_NUMBER_OF_MESSAGES,
      validate: validateNumber,
    },
    {
      type: 'input',
      name: 'VisibilityTimeout',
      message: 'How long do you want your messages to invisible? (VisibilityTimeout) seconds',
      default: DEFAULT_VISIBILITY_TIMEOUT,
      validate: validateNumber,
    },
    {
      type: 'input',
      name: 'WaitTimeSeconds',
      message: 'How long do you want to wait for polling messages? (WaitTimeSeconds) seconds',
      default: DEFAULT_WAIT_TIME_SECONDS,
      validate: validateNumber,
    },
  ];
  const answer = await inquirer.prompt(questions);
  const result = await sqs.receiveMessage({
    MaxNumberOfMessages: Number(answer.MaxNumberOfMessages),
    VisibilityTimeout: Number(answer.VisibilityTimeout),
    WaitTimeSeconds: Number(answer.WaitTimeSeconds),
  });
  const { Messages } = result;
  if (Messages) {
    console.log('Poll Messages Success:\n', prettyjson.render(Messages));
    console.log(
      emoji.emojify(
        `:white_check_mark:  ${chalk.green.bold(`Total Messages: ${Messages.length}`)}`,
      ),
    );
  } else {
    console.log(emoji.emojify(`:exclamation:  ${chalk.bold.red('Sorry. No message available')}`));
  }
  return result;
};
