const purgeQueue = (sqs, QueueUrl) => async () => {
  const params = {
    QueueUrl,
  };
  return sqs.purgeQueue(params).promise();
};

export default purgeQueue;
