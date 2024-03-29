const router = require('express').Router();
const userController = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');

router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.profile);
router.post('/logout', authMiddleware, userController.logout);
router.get('/api/create_link_token/us', userController.createLinkTokenUS);
router.get('/api/create_link_token/es', userController.createLinkTokenES);
router.get('/api/create_link_token/gb', userController.createLinkTokenGB);
router.post('/api/exchange_public_token', userController.exchangePublicToken);
router.get('/api/balance', userController.getBalances);

module.exports = router;
