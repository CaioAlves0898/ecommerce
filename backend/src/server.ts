import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`📝 API: http://localhost:${config.port}`);
  console.log(`🏥 Health: http://localhost:${config.port}/health`);
});