import infoErrors from '../../utils/enum.error.js';

export default (error, req, res, next) => {
    console.log(error.cause)


    switch (error.code) {
        case infoErrors.permissionError:
            res.json({ error: error.name });
            break;
        case infoErrors.dataBaseError:
            res.json({ error: error.name });
            break;
        case infoErrors.infoNewUserError:
            res.json({ error: error.name });
            break;
        case infoErrors.productCreateError:
            res.json({ error: error.name });
            break;
        default:
            res.json({ error: 'Uncaught error' })
    }
};