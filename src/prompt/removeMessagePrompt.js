import inquirer from 'inquirer';

export default async sqs => {
  const questions = [
    {
      type: 'input',
      name: 'ReceiptHandle',
      message: "What's ReceiptHandle value of the message you want to remove?",
    },
  ];
  const answer = await inquirer.prompt(questions);
  const result = await sqs.removeMessage({
    ReceiptHandle: answer.ReceiptHandle,
  });
  console.log(result);
  return result;
};
