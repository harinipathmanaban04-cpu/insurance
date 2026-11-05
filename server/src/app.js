import { connectDB } from './config/db.js';
import { sendOtp, verifyOtp } from './controllers/otpController.js';
import {
  submitApplication,
  listApplications,
  updateApplicationStatus,
} from './controllers/applicationController.js';
import { submitCallback } from './controllers/callbackController.js';
import { submitEnquiry } from './controllers/enquiryController.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { otpRateLimiter, enquiryRateLimiter } from './middleware/rateLimiter.js';

// Load environment variables (dotenv or Node built-in)
try {
  const dotenv = (await import('dotenv')).default;
  dotenv.config();
} catch {
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {}
  }
}

// Connect DB (resilient)
connectDB().catch((err) => {
  console.warn('[Database Notice]', err.message);
});

// Try loading express and cors dynamically
let expressApp = null;

try {
  const expressModule = (await import('express')).default;
  const corsModule = (await import('cors')).default;
  const apiRoutes = (await import('./routes/index.js')).default;

  const app = expressModule();

  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(
    corsModule({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(expressModule.json({ limit: '10mb' }));
  app.use(expressModule.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/api', apiRoutes);

  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to THE BEST INSURANCE POINT Backend API',
      documentation: '/api/health',
      version: '1.0.0',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  expressApp = app;
} catch (err) {
  // Express / Cors not yet installed locally in node_modules - fallback to built-in HTTP dispatcher
  console.warn('[Server notice] Express/CORS not installed in local node_modules. Using built-in Node.js API dispatcher.');
}

/**
 * Built-in Node.js HTTP fallback dispatcher (zero external dependencies required)
 */
async function nativeHttpDispatcher(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Helpers
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  };

  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  req.query = Object.fromEntries(url.searchParams.entries());

  // Parse JSON Body
  let body = {};
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }
  }
  req.body = body;

  const next = (err) => {
    if (err) return errorHandler(err, req, res);
    return notFoundHandler(req, res);
  };

  // Route matching
  if (pathname === '/' || pathname === '/api') {
    return res.status(200).json({
      message: 'THE BEST INSURANCE POINT API is online',
      version: '1.0.0',
    });
  }

  if (pathname === '/api/health') {
    return res.status(200).json({
      status: 'online',
      service: 'THE BEST INSURANCE POINT API',
      timestamp: new Date().toISOString(),
    });
  }

  if (pathname === '/api/otp/send' && req.method === 'POST') {
    return otpRateLimiter(req, res, () => sendOtp(req, res, next));
  }

  if (pathname === '/api/otp/verify' && req.method === 'POST') {
    return verifyOtp(req, res, next);
  }

  if ((pathname === '/api/applications/submit' || pathname === '/api/enquiries/submit') && req.method === 'POST') {
    return submitApplication(req, res, next);
  }

  if ((pathname === '/api/applications' || pathname === '/api/enquiries/list') && req.method === 'GET') {
    return listApplications(req, res, next);
  }

  const patchMatch = pathname.match(/^\/api\/applications\/([^/]+)\/status$/);
  if (patchMatch && (req.method === 'PATCH' || req.method === 'POST')) {
    req.params = { id: patchMatch[1] };
    return updateApplicationStatus(req, res, next);
  }

  if (pathname === '/api/enquiries/list' && (req.method === 'PATCH' || req.method === 'POST')) {
    req.params = { id: req.body?.applicationId };
    return updateApplicationStatus(req, res, next);
  }

  if (pathname === '/api/callback' && req.method === 'POST') {
    return submitCallback(req, res, next);
  }

  if ((pathname === '/api/enquiries' || pathname === '/api/enquiry') && req.method === 'POST') {
    return enquiryRateLimiter(req, res, () => submitEnquiry(req, res, next));
  }

  return notFoundHandler(req, res);
}

// Exported app handler (handles both Express app and native fallback)
export default function appHandler(req, res) {
  if (expressApp) {
    return expressApp(req, res);
  }
  return nativeHttpDispatcher(req, res);
}
