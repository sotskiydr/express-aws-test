const {S3} = require('aws-sdk')
const cryptoRandomString = require("crypto-random-string");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY;
const bucketSecretKey = process.env.AWS_SECRET_KEY;

exports.s3Uploadv2 = async (file, type) => {
    const s3 = new S3()
    const fileKey = type === 'video' ?
        `files/video/${cryptoRandomString({ length: 30 })}-${file.originalname}`
        :
        `files/picture/${cryptoRandomString({ length: 30 })}-${file.originalname}`;

    const param = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer
    };
    return await s3.upload(param).promise()
}