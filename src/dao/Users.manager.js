import UserModel from "../models/user.model.js";

export default class UserManager {
    static async getByEmail(email){
        const user = await UserModel.findOne({ email: email });
        return user;
    }

    static async create(data) {
        if (data.email === 'adminCoder@coder.com' && data.password ==='adminCod3r123'){
            data.rol = 'admin';
        }
        const user = await UserModel.create(data);
        return user;
    }
}