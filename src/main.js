import './init';

import terminalImage from 'terminal-image';
import path from 'path';
import initPrompt from './prompt/initPrompt';
import loopPrompt from './prompt/loopPrompt';
import getStarted from './chapter1/getStarted';

const main = async () => {
  const imagePath = path.join(__dirname, './assets/unicorn.jpg');
  console.log(await terminalImage.file(imagePath));
  getStarted();
  const sqs = await initPrompt();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    await loopPrompt(sqs);
  }
};

export default main;
