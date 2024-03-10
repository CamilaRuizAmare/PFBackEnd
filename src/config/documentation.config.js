import swaggerJsdoc from 'swagger-jsdoc';


const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentación del ecommerce',
            description: 'En esta documentación usted podrá verificar de qué manera funciona el proyecto del ecommerce',
        },
    },
    apis:[`${process.cwd()}/src/docs/**/*.yaml`]
};
const spec = swaggerJsdoc(swaggerOptions);

export default spec