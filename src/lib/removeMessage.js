const removeMessage = (sqs, sqsQueueURl) => async message =>
  sqs
    .deleteMessage({
      QueueUrl: sqsQueueURl,
      ReceiptHandle: message.ReceiptHandle,
    })
    .promise();

export default removeMessage;
