require('dotenv').config()
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const app = require('./app')(process.env.TEST_DATABASE_URL)
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');
const server = https.createServer({key: key, cert: cert }, app);

server.listen(3000, () => { console.log('listening on 3000') });
