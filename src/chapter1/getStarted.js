import marked from 'marked';
import fs from 'fs';
import path from 'path';

const getStarted = () => {
  const content = fs.readFileSync(path.join(__dirname, '../documents', 'chapter1-get-started.md'));
  console.log(marked(content.toString()));

  const usageContent = fs.readFileSync(
    path.join(__dirname, '../documents', 'aws-sqs-cli-usage.md'),
  );
  console.log(marked(usageContent.toString()));
};

export default getStarted;
