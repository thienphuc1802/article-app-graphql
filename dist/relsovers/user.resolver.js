"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolversUser = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generate_1 = require("../helpers/generate");
exports.resolversUser = {
    Query: {
        getUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (context.user) {
                    const infoUser = yield user_model_1.default.findOne({
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
                        };
                    }
                    else {
                        return {
                            code: 400,
                            message: "That bai",
                        };
                    }
                }
                else {
                    return {
                        code: 403,
                        message: "khong co quyen truy cap",
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                };
            }
        })
    },
    Mutation: {
        registerUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { user } = args;
                const emailExist = yield user_model_1.default.findOne({
                    email: user.email
                });
                if (emailExist) {
                    return {
                        code: 400,
                        message: "Email da ton tai",
                    };
                }
                else {
                    user.password = (0, md5_1.default)(user.password);
                    user.token = (0, generate_1.generateRandomString)(30);
                    const newUser = new user_model_1.default(user);
                    const data = yield newUser.save();
                    return {
                        code: 200,
                        message: "Dang ky thanh cong",
                        id: data._id,
                        email: data.email,
                        fullName: data.fullName,
                        token: data.token,
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                };
            }
        }),
        loginUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { email, password } = args.user;
                const infoUser = yield user_model_1.default.findOne({
                    email: email,
                    deleted: false
                });
                if (!infoUser) {
                    return {
                        code: 400,
                        message: "Email khong ton tai",
                    };
                }
                if ((0, md5_1.default)(password) !== infoUser.password) {
                    return {
                        code: 400,
                        message: "Mat khau khong dung",
                    };
                }
                return {
                    code: 200,
                    message: "Dang nhap thanh cong",
                    id: infoUser.id,
                    email: infoUser.email,
                    fullName: infoUser.fullName,
                    token: infoUser.token,
                };
            }
            catch (error) {
                return {
                    code: 500,
                    message: "Loi server",
                };
            }
        })
    }
};
