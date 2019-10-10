import './init';

import terminalImage from 'terminal-image';
import path from 'path';
import initPrompt from './prompt/initPrompt';
import loopPrompt from './prompt/loopPrompt';

const main = async () => {
  const imagePath = path.join(__dirname, './assets/unicorn.jpg');
  console.log(await terminalImage.file(imagePath));
  const sqs = await initPrompt();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    await loopPrompt(sqs);
  }
};

export default main;
