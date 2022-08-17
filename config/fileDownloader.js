const multer = require('multer');
const cryptoRandomString = require("crypto-random-string");
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
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

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY;
const bucketSecretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey
    }
})

const upload = multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
        const fileName = `${cryptoRandomString({ length: 30 })}.${extension}`;
        cb(null, fileName);
    }
})

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
    fileImageUploader: multer({
        storage: pictureStorage, fileImageFilter
    }),
    s3Uploader: multer({
        storage: upload,
        limits: { fileSize: 60 * 1024 * 1024 },
        fileFilter: fileVideoFilter
    })
}