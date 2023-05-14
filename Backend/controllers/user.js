const AWS = require("aws-sdk");
const multer = require("multer");
const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { getOne, updateOne, getAll } = require("./crud");
const APIFeatures = require("../utils/apiFeatures");

const allowedUpdateFieldsForUsers = [
  "name",
  "jobTitle",
  "description",
  "avatar",
  "background",
];

const prepareUserSelectMiddleware = (req, res, next) => {
  req.selectOptions = "name jobTitle description email avatar background";

  next();
};
const getUser = getOne(User);

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

const getImageData = imageUpload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

const checkForImagesUpload = (req, res, next) => {
  console.log(req.files.avatar);
};

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

const uploadAvatar = catchAsync(async (req, res, next) => {
  const { avatar } = req.files;
  if (!avatar) return next();

  const avatarFileName = `${req.user._id}.jpg`;

  const imageUrl = await uploadFile(avatar[0], avatarFileName, "users/avatar");

  req.body.avatar = imageUrl;

  next();
});

const uploadBackground = async (req, res, next) => {
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

const updateUser = updateOne(User);

const prepareGetAllJoinedProjectsMiddleware = catchAsync(
  async (req, res, next) => {
    const projectIds = await ProjectMember.find({
      memberId: req.user._id,
    }).distinct("projectId");
    req.body = { _id: { $in: projectIds } };
    next();
  }
);

const prepareGetCurrentUserProfileMiddleware = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const searchUsers = catchAsync(async (req, res, next) => {
  let { q } = req.query;

  if (!q) {
    q = "";
  }

  const searchQuery = { $regex: q, $options: "i" };

  const query = User.find({
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { description: searchQuery },
      { jobTitle: searchQuery },
    ],
  });

  req.query.fields = "email name jobTitle avatar background description";

  const features = new APIFeatures(query, req.query)
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      length: users.length,
      users,
    },
  });
});

module.exports = {
  prepareUserSelectMiddleware,
  getUser,
  prepareGetAllJoinedProjectsMiddleware,
  prepareGetCurrentUserProfileMiddleware,
  prepareUpdateUserRouteMiddleware,
  updateUser,
  checkForImagesUpload,
  searchUsers,
  getImageData,
  uploadAvatar,
  uploadBackground,
};
