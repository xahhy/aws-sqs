import './init';

import terminalImage from 'terminal-image';
import path from 'path';
import { EventEmitter } from 'events';
import initPrompt from './prompt/initPrompt';
import loopPrompt from './prompt/loopPrompt';
import getStarted from './chapter1/getStarted';

const EventBus = new EventEmitter();
global.EventBus = EventBus;

const main = async () => {
  const imagePath = path.join(__dirname, './assets/unicorn.jpg');
  console.log(await terminalImage.file(imagePath));
  getStarted();
  const sqs = await initPrompt();
  let loop = true;
  EventBus.on('quit', () => {
    loop = false;
  });
  // eslint-disable-next-line no-constant-condition
  while (loop) {
    // eslint-disable-next-line no-await-in-loop
    await loopPrompt(sqs);
  }
};

export default main;
