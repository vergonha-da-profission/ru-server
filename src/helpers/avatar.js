const Avatar = require('avatar-builder');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/*
    *@returns: path of image
*/
exports.createAvatar = async () => {
  const destinationPath = path.join(__dirname, '..', '..', 'public', '/avatar/');
  const imageName = `${uuidv4()}.png`;
  const catAvatar = Avatar.catBuilder(1000);

  fs.writeFileSync((destinationPath + imageName), await catAvatar.create(imageName));
  return `/public/avatar/${imageName}`;
};
