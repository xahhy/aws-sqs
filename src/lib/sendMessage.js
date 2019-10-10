const sendMessage = (sqs, QueueUrl) => async message => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl,
  };
  return sqs.sendMessage(params).promise();
};

export default sendMessage;
