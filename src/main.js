import './init';

import terminalImage from 'terminal-image';
import initPrompt from './prompt/initPrompt';
import loopPrompt from './prompt/loopPrompt';
import path from 'path';

const main = async () => {
  const imagePath = path.join(
    // eslint-disable-next-line
    path.dirname(new URL(import.meta.url).pathname),
    './assets/unicorn.jpg'
  );
  console.log(await terminalImage.file(imagePath));
  const sqs = await initPrompt();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    await loopPrompt(sqs);
  }
};

export default main;
