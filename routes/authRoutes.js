const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register Route
router.get('/register', (req, res) => res.render('register', { title: 'Register', errors: req.flash('error') }));
router.post('/register', authController.register);

// Login Route
router.get('/login', (req, res) => res.render('login', { title: 'Login', errors: req.flash('error') }));
router.post('/login', authController.upload.single('personalQr'), authController.login);

module.exports = router;
