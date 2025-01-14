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
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("./db/schema");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8001;
app.use((0, cors_1.default)({
    origin: "https://main.d2dwjnixvn5b5o.amplifyapp.com",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express_1.default.json());
// @ts-ignore
app.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empId } = req.body;
    const isPresent = yield schema_1.UserModel.findOne({ empId });
    if (isPresent) {
        return res.json({ message: "user already present" });
    }
    const newUser = new schema_1.UserModel(req.body);
    yield newUser.save();
    const pmId = req.body.productManagerId;
    if (pmId) {
        yield schema_1.UserModel.findOneAndUpdate({ empId: pmId }, { $push: { employees: newUser.empId } }, { new: true });
    }
    res.json({ message: "user created successfully" });
}));
// @ts-ignore
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empId, password } = req.body;
    const user = yield schema_1.UserModel.findOne({ empId });
    if (!user) {
        return res.json({ message: "user not present" });
    }
    if (password !== user.password) {
        return res.json({ message: "Password Incorrect" });
    }
    const userPayload = {
        empId: user.empId,
        role: user.role,
        users: user.employees,
    };
    if (process.env.JWT_SECRET) {
        const token = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_SECRET);
        res.json({ token });
    }
}));
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    (0, schema_1.connectDB)();
});
