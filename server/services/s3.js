require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');

const s3AccessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`;
const s3AccessSecret = `${process.env.AWS_SECRET_ACCESS_KEY}`;
const s3Region = `${process.env.AWS_REGION}`;
const s3Bucket = `${process.env.AWS_S3_BUCKET_NAME}`;

const s3 = new AWS.S3({
	credentials: {
		accessKeyId: s3AccessKeyId,
		secretAccessKey: s3AccessSecret,
		region: s3Region
	}
});

const uploadFileToS3 = async (file) => {
	const fileStream = fs.createReadStream(file.tempFilePath);
	fileStream.on('error', (err) => {
		console.log('Create Read Stream Error', err);
	});

	const uploadParams = { Bucket: s3Bucket, Key: file.name, Body: fileStream };

	return s3
		.upload(uploadParams, (err, data) => {
			if (err) {
				throw err;
			}
			console.log('Success!', data);
		})
		.promise();
};

const getS3ObjectStream = async (data) => {
	const s3Stream = s3
		.getObject({
			Bucket: data.Bucket,
			Key: data.Key
		})
		.createReadStream();

	return s3Stream;
};

module.exports = { uploadFileToS3, getS3ObjectStream };
