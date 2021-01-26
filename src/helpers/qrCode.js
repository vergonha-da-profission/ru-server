const qrCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/*
    *@params: user_id
    *@returns: path of image
*/
exports.createImage = async (userId) => {
  const destinationPath = path.join(__dirname, '..', '..', 'public', 'qr-code');
  const imageName = `${uuidv4()}.png`;

  qrCode.toFile(`${destinationPath}/${imageName}`, userId.toString(), {
    color: {
      light: '#0000',
    },
    width: 1000,
    errorCorrectionLevel: 'H',
  });

  return `/public/qr-code/${imageName}`;
};
