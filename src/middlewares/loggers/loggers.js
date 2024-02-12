import getLogger from "../../logger/factory.logger.js";

const addLogger = async (req, res, next) => {
    const {logger} = await getLogger();
    req.logger = logger;
    req.logger.INFO(`${new Date()} || ${req.method} from ${req.url}`);

    next();
};

export default addLogger;