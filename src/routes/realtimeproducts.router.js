import express from 'express';

const realTimeRouter = express.Router();

realTimeRouter.get('/', (req, res)=>{
    res.render('index');
});

export default realTimeRouter;