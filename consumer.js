const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-1',
});

const app = Consumer.create({
  queueUrl: 'https://sqs.ap-southeast-1.amazonaws.com/242057567132/fifo-queue.fifo',
  handleMessage: async (message) => {
    console.log('this is the message', message);
  },
  sqs: new AWS.SQS(),
});

app.on('message_received', (message) => {
  console.log('When receive the message', message);
});
app.start();
