class userDTO{
    constructor(user) {
        this.completeName = user?.first_name + ' ' + user?.last_name
        this.first_name = user?.first_name;
        this.last_name = user?.last_name;
        this._id = user?._id;
        this.email = user?.email;
        this.age = user?.age;
        this.role = user?.role;
        this.cartID = user?.cart._id;
        this.cartStatus = user?.cart.status
        this.tokenRecoveryPass = user?.tokenRecoveryPass || ''
    }
};

export default userDTO;