const getQueueAttributes = (sqs, QueueUrl) => async () => {
  const params = {
    QueueUrl,
    AttributeNames: ['All'],
  };
  return sqs.getQueueAttributes(params).promise();
};

export default getQueueAttributes;
