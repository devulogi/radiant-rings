const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
  hashPassword,
  comparePassword,
  findOrCreate
} = require('./model.functions');
const {
  addressSchema,
  orderSchema,
  wishlistSchema,
  cartSchema,
  reviewSchema
} = require('./schemas');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 50
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    address: addressSchema,
    cart: [cartSchema],
    wishlist: [wishlistSchema],
    orders: [orderSchema],
    reviews: [reviewSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', async function (next) {
  // check if username or email is already taken before saving
  UserSchema.path('username').validate(async (username) => {
    const userCount = await mongoose.models.User.countDocuments({ username });
    return !userCount;
  }, 'Username already taken!!');
  UserSchema.path('email').validate(async (email) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  }, 'Email already taken!!');

  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const hash = await hashPassword(user.password);
    user.password = hash;
    next();
  } catch (err) {
    console.log(err);
  }
});

UserSchema.pre('updateOne', async function (next) {
  const user = this;
  try {
    const hash = await hashPassword(user.password);
    user.password = hash;
    next();
  } catch (err) {
    console.log(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  const isMatch = await comparePassword(candidatePassword, user.password);
  return isMatch;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

async function findByCredentials(username, password) {
  const User = this;
  try {
    const user = await User.findOne({ username });
    if (!user) return null;
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return null;
    return user;
  } catch (err) {
    throw new Error({
      message: 'Error finding user',
      error: err
    });
  }
}

UserSchema.statics.findByCredentials = async function (username, password) {
  try {
    const user = await findByCredentials(username, password);
    if (!user) return null;
    return user;
  } catch (err) {
    console.log(err);
  }
};

UserSchema.statics.findOrCreate = async function (profile) {
  try {
    const user = await findOrCreate(profile);
    return user;
  } catch (err) {
    console.log(err);
  }
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
  UserModel,
  hashPassword,
  comparePassword
};
