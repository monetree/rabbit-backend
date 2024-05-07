// Import the AWS SDK
const AWS = require("aws-sdk");
const axios = require("axios");
const stream = require("stream");
const csv = require("csv-parser");
const { Readable } = require("stream");

// Configure AWS with your access key, secret key, and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
  region: process.env.AWS_REGION, // Your AWS region
});

// Create an S3 instance to interact with AWS S3 service
const s3 = new AWS.S3();

// Define the name of your S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME; // Replace with your actual bucket name

/**
 * Uploads a file to an S3 bucket.
 * @param {Buffer|string} fileContent - The content of the file to upload.
 * @param {string} s3FilePath - The path where the file will be stored in the S3 bucket.
 * @returns {Promise<Object>} The result of the upload operation, including the URL of the uploaded file.
 */
const uploadFileToS3 = async (fileContent, s3FilePath) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: `pdf/${s3FilePath}`, // Prefixed path in the bucket to store the PDF
    Body: fileContent, // Content of the file
    ContentType: "application/pdf", // Set content type as PDF
  };

  try {
    // Upload the file to S3 and wait for the promise to resolve
    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult; // Return the upload result
  } catch (error) {
    // Throw an error if the upload fails
    throw error;
  }
};

/**
 * Retrieves a PDF file from S3 and returns its content as a buffer.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} fileKey - The key of the file in the S3 bucket.
 * @returns {Promise<Buffer>} The buffer containing the file content.
 */
const getPdfBuffer = async (bucketName, fileKey) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });
  const { Body } = await s3Client.send(command);
  return new Promise((resolve, reject) => {
    const chunks = [];
    Body.on("data", (chunk) => chunks.push(chunk));
    Body.once("end", () => resolve(Buffer.concat(chunks))); // Combine all chunks
    Body.once("error", reject); // Handle possible errors
  });
};

/**
 * Generates a presigned URL for a file stored in S3, allowing temporary access to the file.
 * @param {string} fileKey - The key of the file in the S3 bucket.
 * @returns {Promise<string>} A presigned URL that grants temporary access to the file.
 */
const generatePresignedUrl = async (fileKey) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const url = await s3.getSignedUrlPromise("getObject", params);
    return url; // The URL is directly returned from the async function
  } catch (error) {
    console.error("Error generating presigned URL", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const toNodeStream = (axiosStream) => {
  const pass = new stream.PassThrough();
  axiosStream.pipe(pass);
  return pass;
};

const uploadImageToS3FromUrl = async (imageUrl, s3Key) => {
  try {
    const response = await axios({
      method: "get",
      url: imageUrl,
      responseType: "stream",
    });

    const fileStream = toNodeStream(response.data);

    const uploadParams = {
      Bucket: bucketName,
      Key: "brands/" + s3Key,
      Body: fileStream,
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult;
  } catch (error) {
    console.error("Error fetching or uploading image:", error);
    throw error;
  }
};

function bufferToStream(buffer) {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
}

const csvToJson = async (csvUrl) => {
  try {
    const response = await axios.get(csvUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);
    const stream = bufferToStream(buffer);
    const results = [];

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          results.shift();
          resolve(results);
        })
        .on("error", (error) => reject(error));
    });
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
  getPdfBuffer,
  generatePresignedUrl,
  uploadImageToS3FromUrl,
  csvToJson,
};
