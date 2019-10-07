const receiveMessage = (sqs, QueueUrl) => async ({
  MaxNumberOfMessages = 1,
  VisibilityTimeout = 20,
  WaitTimeSeconds = 0,
}) => {
  const params = {
    MaxNumberOfMessages,
    VisibilityTimeout,
    WaitTimeSeconds,
    QueueUrl,
    AttributeNames: ['All'],
  };
  return sqs.receiveMessage(params).promise();
};

export default receiveMessage;
