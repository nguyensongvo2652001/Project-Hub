const AWS = require("aws-sdk");
const multer = require("multer");
const { catchAsync, HandledError } = require("../utils/errorHandling");

const prepareGetCurrentUserProfileMiddleware = (req, res, next) => {
  // Some controllers will use req.params.id to operate so we need to set it to the current logged in user 's id
  req.params.id = req.user;
  next();
};

const prepareUserSelectOptionsMiddleware = (req, res, next) => {
  req.selectOptions = "name jobTitle description email avatar background";
  next();
};

const allowedUpdateFieldsForUsers = [
  "name",
  "jobTitle",
  "description",
  "avatar",
  "background",
];

const prepareUpdateUserRouteMiddleware = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdateFieldsForUsers.includes(key)) delete req.body[key];
  });

  req.params.id = req.user._id;

  next();
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const { mimetype } = file;
    if (!mimetype) return cb(null, false);
    if (!mimetype.startsWith("image"))
      return cb(new HandledError("invalid image", 400), false);

    cb(null, true);
  },
});

const getImageDataMiddleware = imageUpload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

const s3 = new AWS.S3({
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APPLICATION_KEY,
  endpoint: process.env.B2_BUCKET_ENDPOINT,
});

const uploadFile = async (file, fileName, folder) => {
  const { buffer } = file;

  const params = {
    Bucket: process.env.B2_BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();

  return result.Location;
};

const uploadAvatarMiddleware = catchAsync(async (req, res, next) => {
  const { avatar } = req.files;
  if (!avatar) return next();

  const avatarFileName = `${req.user._id}.jpg`;

  const imageUrl = await uploadFile(avatar[0], avatarFileName, "users/avatar");

  req.body.avatar = imageUrl;

  next();
});

const uploadBackgroundMiddleware = async (req, res, next) => {
  const { background } = req.files;
  if (!background) return next();

  const backgroundFileName = `${req.user._id}.jpg`;

  const imageUrl = await uploadFile(
    background[0],
    backgroundFileName,
    "users/background"
  );

  req.body.background = imageUrl;

  next();
};

module.exports = {
  prepareGetCurrentUserProfileMiddleware,
  prepareUserSelectOptionsMiddleware,
  prepareUpdateUserRouteMiddleware,
  getImageDataMiddleware,
  uploadAvatarMiddleware,
  uploadBackgroundMiddleware,
};
