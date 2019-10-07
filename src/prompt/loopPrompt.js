import inquirer from 'inquirer';
import chalk from 'chalk';
import emoji from 'node-emoji';
import createMessagePrompt from './createMessagePrompt';
import receiveMessagePrompt from './receiveMessagePrompt';
import removeMessagePrompt from './removeMessagePrompt';
import purgeQueuePrompt from './purgeQueuePrompt';

export default async (sqs) => {
  const actionMap = {
    [emoji.emojify(
      `:star:\t${chalk.green.bold('Create A Message')}`,
    )]: async () => createMessagePrompt(sqs),
    [emoji.emojify(
      `:airplane:\t${chalk.yellow.bold('Poll Messages')}`,
    )]: async () => receiveMessagePrompt(sqs),
    [emoji.emojify(
      `:new_moon_with_face:\t${chalk.red.bold('Remove A Message')}`,
    )]: async () => removeMessagePrompt(sqs),
    [emoji.emojify(
      `:rainbow:\t${chalk.magenta.bold('Get Queue Attributes')}`,
    )]: async () => sqs.getQueueAttributes(),
    [emoji.emojify(
      `:x:\t${chalk.cyanBright.bold('Purge Queue')}`,
    )]: async () => purgeQueuePrompt(sqs),
  };

  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        new inquirer.Separator(),
        ...Object.keys(actionMap),
        new inquirer.Separator(),
      ],
    },
  ];

  const answer = await inquirer.prompt(questions);
  const action = actionMap[answer.action];
  try {
    await action();
  } catch (error) {
    console.error(error);
  }
  return answer;
};
