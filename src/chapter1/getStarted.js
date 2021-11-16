import marked from 'marked';
import fs from 'fs';
import path from 'path';

const readDocumentAsString = (fileName) =>
  fs.readFileSync(path.join(__dirname, '../documents', fileName)).toString();

const getStarted = () => {
  const content = readDocumentAsString('chapter1-get-started.md');
  console.log(marked(content.toString()));

  const usageContent = readDocumentAsString('aws-sqs-cli-usage.md');
  console.log(marked(usageContent.toString()));
};

export default getStarted;
