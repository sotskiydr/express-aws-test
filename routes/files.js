const fs = require("fs");
const path = require("path");
const {Op} = require("sequelize");
const router = require('express').Router();
const axios = require('axios');
const {fileVideoUploader, fileImageUploader, s3Uploader} = require('../config/fileDownloader')
const {Files} = require('../models')
const {s3Uploadv2} = require('../config/s3-config')

router.get('/', async (req, res, next) => {
    const {pageIndex = 0, pageSize = 10} = req.query;
    console.log(process.env.AWS_BUCKET_REGION)
    Files.findAll({
        limit: +pageSize,
        offset: +pageIndex * +pageSize,
        where: {
            path: { [Op.ne]: null },
        },
        order: [['id', 'ASC']],
    })
        .then((videos) => res.json(videos))
        .catch(next);

})

router.post('/video', s3Uploader.single('video'), async (req, res) => {
    const video = await Files.create({
        name: req.file.originalname,
        path: `/files/videos/${req.file.filename}`
    });

    res.json(video)
})

router.post('/picture', fileImageUploader.single('picture'), async (req, res) => {
    const picture = await Files.create({
        name: req.file.originalname,
        path: `/files/pictures/${req.file.filename}`
    });

    res.json(picture)
})

router.delete('/:id', async (req,res) => {
    const file = await Files.findByPk(req.params.id);

    if (!file) {
        return res.status(400).json({ message: 'File does not exist' });
    }
    await file.destroy();
    fs.unlink(path.join(__dirname, '..', file.path), (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.json(file);
})

module.exports = router;