import prettyjson from 'prettyjson';

export default async function getQueueAttributesPrompt(sqs) {
  const result = await sqs.getQueueAttributes();
  const { Attributes } = result;
  console.log('Queue Attributes:\n', prettyjson.render(Attributes));
  return Attributes;
}
