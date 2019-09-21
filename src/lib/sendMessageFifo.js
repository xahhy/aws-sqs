import AWS from 'aws-sdk';

// Set the region
AWS.config.update({ region: 'ap-southeast-2' });

const sendMessageFifo = async (message) => {
  // Create an SQS service object
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

  const body = JSON.stringify(message);

  const params = {
    // DelaySeconds: 10, // Should Not Pass This Paramter When Queue Type Is FIFO
    MessageBody: body,
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageId: "Group1",  // Required for FIFO queues
    MessageGroupId: 'document',
    QueueUrl:
      'https://sqs.ap-southeast-2.amazonaws.com/242057567132/document-process.fifo',
  };
  let result;
  try {
    result = await sqs.sendMessage(params).promise();
    console.log('Success', result);
  } catch (error) {
    console.error('Failed', error);
    result = error;
  }
  return result;
};
export default sendMessageFifo;
