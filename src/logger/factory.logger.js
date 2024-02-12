import config from '../config/env.config.js';

const getLogger = async () => {
    let path;
    switch (config.enviroment) {
        case 'development':
            path = await import('./dev.logger.js')
            break;
        case 'production':
            path = await import('./prod.logger.js')
            break;
        default:
            break;
    };

    return path;
};

export default getLogger;