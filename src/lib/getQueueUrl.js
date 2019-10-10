const getQueueUrl = sqs => async QueueName => {
  const params = {
    QueueName,
  };
  const { QueueUrl } = await sqs.getQueueUrl(params).promise();
  return QueueUrl;
};
export default getQueueUrl;
