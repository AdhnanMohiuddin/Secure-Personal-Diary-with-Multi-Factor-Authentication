// routes/diaryRoutes.js

const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');
const User = require('../models/userModel');

//router.use(ensureAuthenticated);

// Route to logout
router.get('/logout', (req, res, next) => {
    //console.log('Logout route hit'); // used for debugging
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(()=>{
          //  console.log('destroy'); // used for debugging
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
        
    });
});


router.use(ensureAuthenticated);



// Route to view diary entries
router.get('/diary', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const entries = user.diaryEntries;
        res.render('diary', { title: 'Your Diary', user, entries });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load diary entries');
        res.redirect('/');
    }
});

// Route to add a new diary entry
router.post('/diary', async (req, res) => {
    const { entry } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.diaryEntries.push({ date: new Date(), content: entry });
        await user.save();
        res.redirect('/diary');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add diary entry');
        res.redirect('/diary');
    }
});


// Route to render the edit entry page
router.get('/edit-entry/:id', async (req, res) => {
    const user = await User.findById(req.user.id);
    const entry = user.diaryEntries.id(req.params.id);
    res.render('edit-entry', { user, entry });
});

// Route to edit a diary entry
router.post('/edit-entry/:id', async (req, res) => {
    const { content } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const entry = user.diaryEntries.id(req.params.id);
        entry.content = content;
        await user.save();
        res.redirect('/diary');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to edit diary entry');
        res.redirect('/diary');
    }
});

// Route to delete a diary entry
router.post('/delete-entry/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.diaryEntries.pull(req.params.id);
        await user.save();
        res.redirect('/diary');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete diary entry');
        res.redirect('/diary');
    }
});

module.exports = router;


/* // diaryRoutes.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');
const Diary = require('../models/diaryModel');

// Ensure user is authenticated before accessing any diary routes
router.use(ensureAuthenticated);

// Route to view diary entries
router.get('/diary', async (req, res) => {
    try {
        const entries = await Diary.find({ userId: req.user._id });
        res.render('diary', { title: 'Your Diary', entries });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load diary entries');
        res.redirect('/');
    }
});

// Route to add a new diary entry
router.post('/diary', async (req, res) => {
    const { entry } = req.body;

    try {
        const newEntry = new Diary({
            userId: req.user._id,
            entry,
            date: new Date()
        });
        await newEntry.save();
        res.redirect('/diary');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add diary entry');
        res.redirect('/diary');
    }
});

// Route to logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
 */