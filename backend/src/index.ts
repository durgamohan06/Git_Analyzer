import { createServer } from './app.js';
import { env } from './config/env.js';

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});
