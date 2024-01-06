
import md5 from "md5";
import User from "../models/user.model";
import { generateRandomString } from "../helpers/generate";
export const resolversUser = {
    Query: {
        getUser: async (_, args, context) => {
            try {
                if (context.user) {
                    const infoUser = await User.findOne({
                        token: context.user.token,
                        deleted: false
                    }).select("-password");
                    if (infoUser) {
                        return {
                            code: 200,
                            message: "Thanh cong",
                            id: infoUser.id,
                            email: infoUser.email,
                            fullName: infoUser.fullName,
                            token: infoUser.token,
                        }
                    }
                    else {
                        return {
                            code: 400,
                            message: "That bai",
                        }
                    }
                }
                else {
                    return {
                        code: 403,
                        message: "khong co quyen truy cap",
                    }
                }

            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                }
            }
        }
    },
    Mutation: {

        registerUser: async (_, args) => {
            try {
                const { user } = args;
                const emailExist = await User.findOne({
                    email: user.email
                });
                if (emailExist) {
                    return {
                        code: 400,
                        message: "Email da ton tai",
                    }
                }
                else {
                    user.password = md5(user.password);
                    user.token = generateRandomString(30);
                    const newUser = new User(user);
                    const data = await newUser.save();

                    return {
                        code: 200,
                        message: "Dang ky thanh cong",
                        id: data._id,
                        email: data.email,
                        fullName: data.fullName,
                        token: data.token,

                    }

                }

            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                }
            }
        },
        loginUser: async (_, args) => {
            try {
                const { email, password } = args.user;
                const infoUser = await User.findOne({
                    email: email,
                    deleted: false
                });
                if (!infoUser) {
                    return {
                        code: 400,
                        message: "Email khong ton tai",
                    }
                }
                if (md5(password) !== infoUser.password) {
                    return {
                        code: 400,
                        message: "Mat khau khong dung",
                    }
                }
                return {
                    code: 200,
                    message: "Dang nhap thanh cong",
                    id: infoUser.id,
                    email: infoUser.email,
                    fullName: infoUser.fullName,
                    token: infoUser.token,
                }

            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                }
            }
        }

    }
};