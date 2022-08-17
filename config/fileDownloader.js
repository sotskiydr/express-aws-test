const multer = require('multer');
const cryptoRandomString = require("crypto-random-string");
const path = require('path');
const {Files} = require('../models')

// const videoStorage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, path.resolve('./files/videos'))
//     },
//     filename: (req, file, cb) => {
//         const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
//         const fileName = `${cryptoRandomString({ length: 30 })}.${extension}`;
//         cb(null, fileName);
//     },
// });

const videoStorage = multer.memoryStorage();

const pictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./files/pictures'));
    },
    filename: (req, file, cb) => {
        const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
        const fileName = `${cryptoRandomString({ length: 30 })}.${extension}`;
        cb(null, fileName);
    },
})

const fileVideoFilter = async (req, file, cb) => {
    const videoWithProvidedName = await Files.findOne({
        where: { name: file.originalname },
    });
    if (videoWithProvidedName) {
        cb(
            new Error(
                JSON.stringify({
                    message: 'A file with the same name was already uploaded',
                    name: file.originalname,
                })
            )
        );
        return;
    }
    if (!/^video\//.test(file.mimetype)) {
        cb(new Error('Wrong file type'));
        return;
    }

    cb(null, true);
};

const fileImageFilter = (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
        cb(new Error('Wrong file type'));
        return;
    }

    cb(null, true);
}


module.exports = {
    fileVideoUploader: multer({
        storage: videoStorage,
        limits: { fileSize: 60 * 1024 * 1024 },
        fileFilter: fileVideoFilter
    }),
    fileImageFilter: multer({
        storage: pictureStorage, fileImageFilter
    })
}