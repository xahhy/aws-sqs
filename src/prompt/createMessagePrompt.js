import inquirer from 'inquirer';

export default async (sqs) => {
  const questions = [
    {
      type: 'input',
      name: 'message',
      message: "What's the message?",
      default: 'my sqs message',
    },
  ];
  const answer = await inquirer.prompt(questions);
  return sqs.sendMessage(answer.message);
};
