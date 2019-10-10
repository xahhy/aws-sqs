import inquirer from 'inquirer';
import emoji from 'node-emoji';
import chalk from 'chalk';

export default async sqs => {
  const questions = [
    {
      type: 'input',
      name: 'message',
      message: "What's the message?",
      default: 'my sqs message',
    },
    {
      type: 'input',
      name: 'MessageGroupId',
      message: "What's your MessageGroupId?",
      when: () => sqs.type === 'fifo',
    },
  ];
  const answer = await inquirer.prompt(questions);
  let result;
  if (sqs.type === 'fifo') {
    result = await sqs.sendMessage(answer.message, answer.MessageGroupId);
  } else {
    result = await sqs.sendMessage(answer.message);
  }
  console.log(emoji.emojify(`:white_check_mark:  ${chalk.green('Message Send Successfully')}`));
  return result;
};
