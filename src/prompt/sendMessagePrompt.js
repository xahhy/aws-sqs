import inquirer from 'inquirer';

export default async () => {
  const questions = [
    {
      type: 'input',
      name: 'QueueUrl',
      message: "What's your Queue Url?",
    },
  ];
  const answer = await inquirer.prompt(questions);
  console.log(answer);
};
