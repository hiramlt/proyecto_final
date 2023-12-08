import UserModel from "../models/user.model.js";
import { isValidPassword } from "../utils.js";

export default class UserManager {
    static async getByEmail(email){
        const user = await UserModel.findOne({ email: email });
        return user;
    }

    static async getByID(uid){
        const user = await UserModel.findById(uid);
        return user;
    }

    static async create(data) {
        if (data.email === 'adminCoder@coder.com' &&  isValidPassword('adminCod3r123', data.password)){
            data.rol = 'admin';
        }
        const user = await UserModel.create(data);
        return user;
    }
}