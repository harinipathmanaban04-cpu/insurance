import http from 'http';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Support both Express app.listen and Node http.createServer
const server = typeof app.listen === 'function' ? app : http.createServer(app);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 THE BEST INSURANCE POINT Backend Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💼 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`======================================================\n`);
});
