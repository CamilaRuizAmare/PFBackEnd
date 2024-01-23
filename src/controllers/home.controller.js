import express from 'express';

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('index', {
        layout: 'home',
    });
});

export default homeRouter;