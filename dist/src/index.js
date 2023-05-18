"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const morgan_1 = __importDefault(require("morgan"));
const path = __importStar(require("path"));
/**
 * References:
 * https://platform.openai.com/docs/plugins/getting-started/running-a-plugin
 * https://blog.cloudflare.com/magic-in-minutes-how-to-build-a-chatgpt-plugin-with-cloudflare-workers/
 * https://api.github.com/
 * https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.yaml
 * https://dev.to/tirthpatel/node-js-express-app-on-vercel-develop-run-deploy-524a
 */
// Express app initialization
const app = (0, express_1.default)();
// Port and other configuration
const port = process.env.PORT || 3333;
const targetUrl = process.env.TARGET_URL;
const username = process.env.USERNAME;
const accessToken = process.env.PAT;
// Request Logger
app.use((0, morgan_1.default)('combined'));
// Serves static files from the public folder
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Setup reverse proxy
app.use('/api', (0, http_proxy_middleware_1.createProxyMiddleware)({
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
