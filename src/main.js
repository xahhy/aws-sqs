import './init';

import initPrompt from './prompt/initPrompt';
import loopPrompt from './prompt/loopPrompt';

const main = async () => {
  const sqs = await initPrompt();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    await loopPrompt(sqs);
  }
};

export default main;
