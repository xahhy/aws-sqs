import inquirer from 'inquirer';
import emoji from 'node-emoji';
import chalk from 'chalk';

export default async (sqs) => {
  const questions = [
    {
      type: 'confirm',
      name: 'isPurgeQueue',
      message: 'Are you sure?',
      default: false,
    },
  ];
  const answer = await inquirer.prompt(questions);
  let result;
  if (answer.isPurgeQueue) {
    result = await sqs.purgeQueue();
    console.log(emoji.emojify(`:white_check_mark:  ${chalk.green('Queue Purged In Progress')}`));
  }
  return result;
};
