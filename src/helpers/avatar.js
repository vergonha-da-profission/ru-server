const Avatar = require('avatar-builder');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/*
    *@params: user
    *@returns: path of image
*/
exports.createAvatar = async (user) => {
  const destinationPath = `${path.join(__dirname, '../../', 'public')}/avatar/`;
  const imageName = `${uuidv4()}.png`;
  const catAvatar = Avatar.catBuilder(1000);
  try {
    fs.writeFileSync((destinationPath + imageName), await catAvatar.create(imageName));
    return imageName;
  } catch (err) {
    return 'can\'t create image';
  }
};
