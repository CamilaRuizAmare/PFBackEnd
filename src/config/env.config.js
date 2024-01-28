import dotenv from 'dotenv';
dotenv.config();

export default {
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