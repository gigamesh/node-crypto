// https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const AppendInitVect = require("./helpers/appendInitVect");

const getCipherKey = require("./helpers/getCipherKey");

function encrypt({ file, password }) {
  // Generate a secure, pseudo random initialization vector.
  const initVect = crypto.randomBytes(16);

  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  // Create a write stream with a different file extension.
  const writeStream = fs.createWriteStream(path.join(file + ".enc"));

  readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writeStream);
}

encrypt({ file: "./file.txt", password: "dogzrgr8" });
