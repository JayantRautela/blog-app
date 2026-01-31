import multer from "multer";

const storage = multer.memoryStorage();

const uplaodFile = multer({ storage }).single("file");

export default uplaodFile;