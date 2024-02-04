import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

faker.location = 'es';

const generateProducts = () => {
    return {
        _id: uuidv4(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        code: uuidv4().toString(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.url(),
        category: faker.commerce.department(),
        stock: faker.string.numeric(2, {bannedDigits: ['0']}),
    }
};

export default generateProducts;