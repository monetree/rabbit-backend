const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
  region: process.env.AWS_REGION, // Your AWS region
});

const s3 = new AWS.S3();

const ImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `receipts/${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
    shouldTransform: (req, file, cb) => {
      // Only transform files based on condition (e.g., if you only want to set headers for images)
      cb(null, /^image\/.+$/.test(file.mimetype));
    },
    transforms: [
      {
        id: "original",
        key: (req, file, cb) => {
          // You can adjust the file name here if necessary
          cb(null, `receipts/${Date.now().toString()}-${file.originalname}`);
        },
        transform: (req, file, cb) => {
          // Set additional headers or perform transformations here if necessary
          // For example, setting Content-Disposition
          // Note: This example does not perform actual transformation; it's just for structure
          cb(null, file.stream, {
            ContentType: file.mimetype,
            ContentDisposition: "inline",
          });
        },
      },
    ],
  }),
});

module.exports = ImageUpload;
