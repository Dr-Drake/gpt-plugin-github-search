import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import * as path from 'path'

/**
 * References:
 * https://platform.openai.com/docs/plugins/getting-started/running-a-plugin
 * https://blog.cloudflare.com/magic-in-minutes-how-to-build-a-chatgpt-plugin-with-cloudflare-workers/
 * https://api.github.com/
 * https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.yaml
 * https://dev.to/tirthpatel/node-js-express-app-on-vercel-develop-run-deploy-524a
 */

// Express app initialization
const app: Express = express();

// Port and other configuration
const port = process.env.PORT || 3333;
const targetUrl = process.env.TARGET_URL;
const username = process.env.USERNAME;
const accessToken = process.env.PAT;

// Request Logger
app.use(morgan('combined'))

// Serves static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Setup reverse proxy
app.use('/api', createProxyMiddleware({ 
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/', // rewrite /api to /
    },
    onProxyReq: (proxyReq) => {

        // Add Basic Authentication header
        const basicAuth = Buffer.from(`${username}:${accessToken}`).toString('base64'); // replace 'username:password' with your actual username and password
        proxyReq.setHeader('Authorization', `Basic ${basicAuth}`);
    },
}));

// Listen for incoming HTTP requests on specified PORT
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});