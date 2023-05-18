import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan'

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
app.use(express.static('public'));

// Setup reverse proxy
app.use('/', createProxyMiddleware({ 
    target: targetUrl,
    changeOrigin: true,
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