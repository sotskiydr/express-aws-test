const multer = require('multer');
const cryptoRandomString = require("crypto-random-string");
const { S3Client, DeleteObjectCommand} = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const {Files} = require('../models')

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

const fileImageFilter = async (req, file, cb) => {
    const pictureWithProvidedName = await Files.findOne({
        where: { name: file.originalname },
    });
    if (pictureWithProvidedName) {
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
    if (!/^image\//.test(file.mimetype)) {
        cb(new Error('Wrong file type'));
        return;
    }

    cb(null, true);
}

async function deleteFile(params) {
    return await s3.send(new DeleteObjectCommand(params))
}

module.exports = {
    fileVideoUploader: multer({
        storage: upload,
        limits: { fileSize: 60 * 1024 * 1024 },
        fileFilter: fileVideoFilter
    }),
    fileImageUploader: multer({
        storage: upload,
        fileFilter: fileImageFilter
    }),
    deleteFile
}