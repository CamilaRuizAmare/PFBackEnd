import express from 'express';

const testLogger = express.Router();

testLogger.get('/', (req, res) => {
    req.logger.FATAL('Prueba de logger');
    req.logger.ERROR('Prueba de logger');
    req.logger.WARNING('Prueba de logger');
    req.logger.INFO('Prueba de logger');
    req.logger.HTTP('Prueba de logger');
    req.logger.DEBUG('Prueba de logger');
    res.json({'test': 'Prueba de loggers con Winston'});
});

export default testLogger;