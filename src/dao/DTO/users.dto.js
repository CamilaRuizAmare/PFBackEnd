class userDTO{
    constructor(user) {
        this.completeName = user?.first_name + ' ' + user?.last_name
        this.first_name = user?.first_name;
        this.last_name = user?.last_name;
        this.email = user?.email;
        this.role = user?.role;
        this.cartID = user?.cart._id;
        this.cartStatus = user?.cart.status
    }
};

export default userDTO;