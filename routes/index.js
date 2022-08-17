const router = require('express').Router();
const files = require('./files')

router.use('/files', files);

module.exports = router;
