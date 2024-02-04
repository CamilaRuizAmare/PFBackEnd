export const generatePermissionError = () => {
    return 'You do not have permissions to access this page. If you think you should have it, please contact the administrator'
}

export const generateDataBaseError = () => {
    return 'There was an error connecting to the database, please try again'
};

export const generateNewUserError = (user) => {
    let infoPass
    if(user.password) {
       infoPass = 'Your password is recieved'
    }
    else {
        infoPass = 'Please enter your password correctly'
    }
    return `
    Some required data has not been uploaded or has not been done correctly.
    Are required:
    first_name: needs to be a string, received: ${user.first_name},
    last_name: needs to be a string, received: ${user.last_name},
    email: needs to be a string, received: ${user.email},
    password: needs to be a string, ${infoPass}`
};

const generateProductCreateError = (product) => {
    return `
    Some required data has not been uploaded or has not been done correctly.
    Are required:
    title: needs to be a string, received: ${product.title},
    description: needs to be a string, received: ${product.description},
    price: needs to be a number, received: ${product.price},
    code: needs to be a string, received: ${product.code},
    stock: needs to be a number, received: ${product.stock}
    `
};


export default generateProductCreateError;