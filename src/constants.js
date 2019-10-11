import emoji from 'node-emoji';
import chalk from 'chalk';

const ACTIONS = {
  PULL_MESSAGE_ACTION: emoji.emojify(`:airplane:\t${chalk.yellow.bold('Pull Messages')}`),
  CREATE_MESSAGE_ACTION: emoji.emojify(`:star:\t${chalk.green.bold('Create A Message')}`),
  REMOVE_MESSAGE_ACTION: emoji.emojify(
    `:new_moon_with_face:\t${chalk.red.bold('Remove A Message')}`,
  ),
  GET_QUEUE_ATTRIBUTES_ACTION: emoji.emojify(
    `:rainbow:\t${chalk.magenta.bold('Get Queue Attributes')}`,
  ),
  PURE_QUEUE_ACTION: emoji.emojify(`:x:\t${chalk.cyanBright.bold('Purge Queue')}`),
  QUIT: emoji.emojify(`:black_square_for_stop:\t${chalk.bold('Quit')}`),
};
// eslint-disable-next-line
export { ACTIONS };
