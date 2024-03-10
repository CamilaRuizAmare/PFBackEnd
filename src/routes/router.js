import swaggerUi from 'swagger-ui-express';
import spec from '../config/documentation.config.js';
import {productsRouter} from '../controllers/products.controller.js'
import homeRouter from '../controllers/home.controller.js';
import {cartRouter} from '../controllers/cart.controller.js';
import editProductsRouter from '../controllers/editProducts.controller.js';
import sessionRouter from './api/sessions.js';
import profileRouter from '../controllers/profile.controller.js';
import chatRouter from '../controllers/chat.controller.js';
import mockingRouter from '../controllers/mocking.controller.js';
import testLogger from '../controllers/testLogger.controller.js';
import recoveryPassRouter from '../controllers/recoveryPass.controller.js';
import changeRoleRouter from '../controllers/roleUser.controller.js';

const routerGral = (app) => {
    app.use('/products', productsRouter);
    app.use('/', homeRouter);
    app.use('/api/carts', cartRouter);
    app.use('/realtimeproducts', editProductsRouter);
    app.use('/api/sessions', sessionRouter);
    app.use('/profile', profileRouter);
    app.use('/chatUsers', chatRouter);
    app.use('/mockingproducts', mockingRouter);
    app.use('/loggerTest', testLogger);
    app.use('/api/sessions/recoveryPass', recoveryPassRouter);
    app.use('/api/users', changeRoleRouter);
    app.use('/api', swaggerUi.serve, swaggerUi.setup(spec));
}

export default routerGral;