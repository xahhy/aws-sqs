import 'dotenv/config';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer(),
});
