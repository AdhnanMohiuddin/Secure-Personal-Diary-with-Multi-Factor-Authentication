const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const User = require('../models/userModel');
const Diary = require('../models/diaryModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const readFile = promisify(fs.readFile);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get file extension (e.g. .png)
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });
exports.upload = upload;

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpSecret = speakeasy.generateSecret({ name: `${username}'s personal dairy TOTP` });
    const personalSecret = speakeasy.generateSecret({ name: "YourAppNamePersonal" });

    const otpQrCodeUrl = await QRCode.toDataURL(otpSecret.otpauth_url);
    const personalQrCodePath = path.join(__dirname, '..', 'public', 'personal_qr', `${username}.png`);
    await QRCode.toFile(personalQrCodePath, personalSecret.otpauth_url);

    const newUser = new User({
      username,
      password: hashedPassword,
      otpSecret: otpSecret.base32,
      personalSecret: personalSecret.base32,
      personalQrCode: `${username}.png`
    });
    await newUser.save();

    res.render('qr', { title: 'Scan QR Code', qrCodeUrl: otpQrCodeUrl });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error');
    res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  const { username, password, token } = req.body;
  const personalQrFile = req.file;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    const otpVerified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: 'base32',
      token
    });

    if (!otpVerified) {
      req.flash('error', 'Invalid OTP');
      return res.redirect('/login');
    }

    const personalQrCodePath = path.join(__dirname, '..', 'public', 'personal_qr', user.personalQrCode);
    const personalQrCodeData = await readFile(personalQrCodePath);
    const uploadedQrCodeData = await readFile(personalQrFile.path);

    if (!uploadedQrCodeData.equals(personalQrCodeData)) {
      req.flash('error', 'Invalid QR code');
      return res.redirect('/login');
    }

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Internal Server Error');
        return res.redirect('/login');
      }
      res.redirect('/diary');
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Internal Server Error');
    res.redirect('/login');
  }
};
