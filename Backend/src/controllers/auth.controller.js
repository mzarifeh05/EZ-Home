const JWT = require('jsonwebtoken');
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


class AuthController {

    async login(req, res) {
        try {

            const { phone, password } = req.body

            if (!phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'رقم الهاتف و كلمة المرور مطلوبان'
                });
            }

            const user = await User.findOne({ phone: phone });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'رقم الهاتف أو كلمة المرور غير صحيحة'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            // const isMatch = await User.findOne({ password: password });

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'رقم الهاتف أو كلمة المرور غير صحيحة'
                });
            }

            const token = JWT.sign({
                UserId: user._id,
                Role: user.role
            }, JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            const userData = await User.findById(user._id).select("-password").lean();

            res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                data: {
                    user: userData,
                    token
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء تسجيل الدخول',
                error: error.message
            });
        }
    }

    async register(req, res) {


        try {

            const { fullName, phone, password } = req.body;

            if (!fullName || !phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'جميع الحقول مطلوبة'
                });
            }
            const existingUser = await User.findOne({ phone: phone });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'رقم الهاتف  مسجل مسبقاً'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                fullName,
                phone,
                password: hashedPassword,
                role: "user"
            });

            await newUser.save();

            const token = JWT.sign({
                UserId: newUser._id,
                role: newUser.role
            },
                JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            const userData = await User.findById(newUser._id).select("-password").lean();

            res.json({
                success: true,
                message: 'تم إنشاء الحساب بنجاح',
                data: {
                    user: userData,
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء إنشاء الحساب',
                error: error.message
            });
        }


    }
}


module.exports = new AuthController();