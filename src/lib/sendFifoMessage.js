const sendFifoMessage = (sqs, QueueUrl, MessageGroupId) => async (message) => {
  if (!MessageGroupId) {
    MessageGroupId = new Date().toISOString();
  }
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl,
    MessageGroupId,
  };
  return sqs.sendMessage(params).promise();
};

export default sendFifoMessage;
