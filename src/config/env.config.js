import dotenv from 'dotenv';

const ENV = 'development';
dotenv.config({
    path: `./.env.${ENV}`
});

export default {
    enviroment: ENV,
    port: process.env.port || 8080,
    dbUrl: process.env.mongo_url,
    privateKey: process.env.privateKey,
    gitAppId: process.env.gitAppId,
    gitClientId: process.env.gitClientId,
    gitClientSecret: process.env.gitClientSecret,
    gitCallbackUrl: process.env.gitCallbackUrl,
    userADM: process.env.adminUser,
    passADM: process.env.adminPassword,
    mailUser: process.env.mailUser,
    mailPassword: process.env.mailPassword,
    serviceMail: process.env.serviceMail,
    serviceMailPort: process.env.serviceMailPort
}