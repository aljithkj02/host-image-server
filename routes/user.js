const { Router } = require('express');
const { signupHandler, loginHandler } = require('../controllers/user.controller');

const router = Router();

router.post('/signup', signupHandler);
router.post('/login', loginHandler);

module.exports = router;