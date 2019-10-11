import inquirer from 'inquirer';
import createMessagePrompt from './createMessagePrompt';
import receiveMessagePrompt from './receiveMessagePrompt';
import removeMessagePrompt from './removeMessagePrompt';
import purgeQueuePrompt from './purgeQueuePrompt';
import getQueueAttributesPrompt from './getQueueAttributesPrompt';
import { ACTIONS } from '../constants';

export default async sqs => {
  const actionMap = {
    [ACTIONS.CREATE_MESSAGE_ACTION]: async () => createMessagePrompt(sqs),
    [ACTIONS.PULL_MESSAGE_ACTION]: async () => receiveMessagePrompt(sqs),
    [ACTIONS.REMOVE_MESSAGE_ACTION]: async () => removeMessagePrompt(sqs),
    [ACTIONS.GET_QUEUE_ATTRIBUTES_ACTION]: async () => getQueueAttributesPrompt(),
    [ACTIONS.PURE_QUEUE_ACTION]: async () => purgeQueuePrompt(sqs),
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
        ACTIONS.QUIT,
      ],
    },
  ];

  const answer = await inquirer.prompt(questions);
  const action = actionMap[answer.action];
  if (!action) {
    global.EventBus.emit('quit');
    return 'quit';
  }
  try {
    await action();
  } catch (error) {
    console.error(error);
  }
  return answer;
};
