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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./db/schema");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8002;
app.use((0, cors_1.default)({
    origin: "https://main.d2dwjnixvn5b5o.amplifyapp.com", // replace with frontend route
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express_1.default.json());
// @ts-ignore
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            let jwtPayload;
            if (process.env.JWT_SECRET !== undefined) {
                jwtPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            }
            // @ts-ignore
            req.empId = jwtPayload === null || jwtPayload === void 0 ? void 0 : jwtPayload.empId;
            next();
        }
        catch (e) {
            // @ts-ignore
            console.log("Error in middleware " + e.message);
            return res.json({ message: "Error in Auth Middleware" });
        }
    });
}
app.get("/user/all", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield schema_1.UserModel.find({});
    //@ts-ignore
    const filteredUsers = users.filter((user) => user.empId !== req.empId);
    res.json({ users: filteredUsers });
}));
app.get("/user/:empId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empId } = req.params;
    const user = yield schema_1.UserModel.findOne({ empId });
    res.json({ user });
}));
//@ts-ignore
app.patch("/user/:empId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empId } = req.params;
    const isPresent = yield schema_1.UserModel.findOne({ empId });
    if (!isPresent) {
        return res.json({ message: "user not present" });
    }
    const user = yield schema_1.UserModel.findOneAndUpdate({ empId }, req.body, {
        new: true,
    });
    res.json({ user });
}));
//@ts-ignore
app.delete("/user/:empId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empId } = req.params;
    const isPresent = yield schema_1.UserModel.findOne({ empId });
    if (!isPresent) {
        return res.json({ message: "user not present" });
    }
    yield schema_1.UserModel.findOneAndDelete({ empId });
    res.json({ message: "user deleted successfully" });
}));
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    (0, schema_1.connectDB)();
});
