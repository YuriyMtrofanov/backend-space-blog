const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const { generateUserData } = require("../utils/generateUserData");
const tokenService = require("../services/token.service");
const router = express.Router({ mergeParams: true });

// ./api/auth/signUp - регистрация
router.post("/signUp", [
    check("email", message = "Некорректный email").isEmail(),
    check("password", message = "Пароль должен содержать не менее 8 символов").isLength({ min: 8 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    error: {
                        message: "INVALID_DATA",
                        code: 400,
                        errors: errors.array()
                    }
                });
            }
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({
                    error: {
                        message: "EMAIL_EXISTS",
                        code: 400
                    }
                })
            }
            const hashedPassword = await bcrypt.hash(password, sold = 12);
            const newUser = await User.create({
                ...generateUserData(),
                ...req.body,
                password: hashedPassword
            });
            const tokens = tokenService.generate({ _id: newUser._id });
            await tokenService.save(newUser._id, tokens.refreshToken);
            res.status(201).send({ ...tokens, userId: newUser._id })
        } catch (error) {
            res.status(500).json({
                messge: "На сервере произошла ошибка. Попробуйте позже..."
            });
        }
    }
]);

// ./api/auth/signInWithPassword - логин
router.post("/signInWithPassword", [
    check("email", message = "Некорректный email").normalizeEmail().isEmail(),  // 1. Валидация email по другой технологии
    check("password", message = "Поле должно быть заполнено").exists(),
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({
                    error: {
                        message: "INVALID_DATA",
                        code: 400,
                        // errors: errors.array()
                    }
                })
            }
            const { email, password } = req.body;    // Получаем email / password
            const existedUser = await User.findOne({ email: email }); // 2. Ищем в коллекции данных пользователя с данным email.
            if (!existedUser){
                return res.status(400).send({
                    error: {
                        message: "EMAIL_NOT_FOUND",
                        code: 400
                    }
                })
            };
            const isPasswordEqual = await bcrypt.compare(password, existedUser.password) // 3. Сравниваем хешированные пароли
            if  (!isPasswordEqual){
                return res.status(400).send({
                    error: {
                        message: "INVALID_PASSWORD",
                        code: 400
                    }
                })
            }
            const tokens = tokenService.generate({_id: existedUser._id}); // 5. Сгенерировать JWT token и Refresh toket
            await tokenService.save(existedUser._id, tokens.refreshToken);
            res.status(201).send({ ...tokens, userId: existedUser._id });  
        } catch (error) {
            res.status(500).json({
                messge: "На сервере произошла ошибка. Попробуйте позже..."
            });
        }
    }
]);

// ./api/auth/token - обновение токена
router.post("/token", async (req, res) => {
    try {
        const { refresh_token: refreshToken } = req.body;
        const data = tokenService.validateRefresh(refreshToken);
        const actualToken = await tokenService.findToken(refreshToken);
        if (!data || !actualToken || data._id !== actualToken?.user?.toString()) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const tokens = await tokenService.generate({ _id: data._id });
        await tokenService.save(data._id, tokens.refreshToken);
        res.status(200).send({...tokens, userId: data._id});
    } catch (error) {
        res.status(500).json({
            messge: "На сервере произошла ошибка. Попробуйте позже..."
        });
    }
});

module.exports = router;