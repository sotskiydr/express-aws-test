const fs = require("fs");
const path = require("path");
const {Op} = require("sequelize");
const router = require('express').Router();
const {fileVideoUploader, fileImageUploader, deleteFile} = require('../config/fileDownloader')
const {Files} = require('../models')

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

router.post('/video', fileVideoUploader.single('video'), async (req, res) => {
    const video = await Files.create({
        name: req.file.originalname,
        path: req.file.location,
        file_key: req.file.key,
        s3_bucket: req.file.bucket
    });

    res.json(video)
})

router.post('/picture', fileImageUploader.single('picture'), async (req, res) => {
    const picture = await Files.create({
        name: req.file.originalname,
        path: req.file.location,
        file_key: req.file.key,
        s3_bucket: req.file.bucket
    });

    res.json(picture)
})

router.delete('/:id', async (req,res) => {
    const file = await Files.findByPk(req.params.id);

    if (!file) {
        return res.status(400).json({ message: 'File does not exist' });
    }
    const data = await deleteFile({ Bucket: file.s3_bucket, Key: file.file_key })
    await file.destroy();

    res.json({data, file});
})

module.exports = router;