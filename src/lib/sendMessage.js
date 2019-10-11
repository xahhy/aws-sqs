const sendMessage = (sqs, QueueUrl) => async message => {
  const params = {
    MessageBody: typeof message === 'string' ? message : JSON.stringify(message),
    QueueUrl,
  };
  return sqs.sendMessage(params).promise();
};

export default sendMessage;
