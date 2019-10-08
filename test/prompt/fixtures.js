import FIFOSQS from '../../src/lib/fifoSqs';
import SQS from '../../src/lib/sqs';

class MockFIFOSQS extends FIFOSQS {
  init() {}

  getQueueAttributes() {}
}

class MockSQS extends SQS {
  init() {}

  getQueueAttributes() {}
}

export {
  MockFIFOSQS,
  MockSQS,
};
