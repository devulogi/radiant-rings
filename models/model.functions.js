const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw new Error({
      message: 'Error comparing passwords',
      error: err
    });
  }
}

async function comparePassword(candidatePassword, hash) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, hash);
    return isMatch;
  } catch (err) {
    throw new Error({
      message: 'Error comparing passwords',
      error: err
    });
  }
}

async function findOrCreate(profile) {
  const User = this;
  const user = await User.findOne({ email: profile.emails[0].value });
  if (user) return user;
  const newUser = new User({
    username: profile.username,
    email: profile.emails[0].value,
    password: profile.id
  });
  try {
    const savedUser = await newUser.save();
    console.log(`User ${savedUser.username} created`);
    return savedUser;
  } catch (err) {
    throw new Error({
      message: 'Error creating user',
      error: err
    });
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  findOrCreate
};
