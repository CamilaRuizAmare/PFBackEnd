import winston from 'winston';
import { customLevelOptions } from '../utils/loggerLevelsCustom.js';


export const logger = winston.createLogger({
    levels: customLevelOptions.level,
    transports: [
        new winston.transports.Console({
            level: 'DEBUG',
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevelOptions.colors,
                }),
                winston.format.simple()
            )   
        }),
        new winston.transports.File({
            filename: './logs/dev/errors.log',
            level: 'ERROR',
            format: winston.format.simple(),
        })
    ]
});

