/* eslint-disable no-undef */
const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');

async function getUserImage(pageMoodle, idUffs, password, imagePath) {
  await pageMoodle.goto('https://moodle-academico.uffs.edu.br/login/index.php');
  await pageMoodle.waitForSelector('#username');

  await pageMoodle.type('#username', idUffs);
  await pageMoodle.type('#password', password);
  await pageMoodle.click('#loginbtn');

  await pageMoodle.waitForSelector('.page-header-image');

  const userPictureUrl = await pageMoodle.evaluate(() => document.querySelector('.page-header-image > a > img').src);

  const cookies = await pageMoodle.cookies();

  const cookiesStringfy = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

  const res = await axios.get(userPictureUrl, {
    headers: {
      Cookie: cookiesStringfy,
    },
    responseType: 'arraybuffer',
  });

  const imageName = `${v4()}.png`;

  const relativePathIndex = imagePath.indexOf('/public/avatar');
  const relativePath = imagePath.slice(relativePathIndex);

  fs.mkdirSync(imagePath, { recursive: true });

  fs.writeFileSync(path.join(imagePath, imageName), res.data);

  const relativePathUrl = path.join(relativePath, imageName);
  return relativePathUrl;
}

function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

async function fetchPortalData(page, authenticator, password) {
  await page.goto('https://aluno.uffs.edu.br/');

  await page.waitForSelector('#idToken1');

  await page.type('#idToken1', authenticator);
  await page.type('#idToken2', password);

  await page.click('#loginButton_0');

  await page.waitForSelector('#j_idt29\\:j_idt31_menu > li:nth-child(3) > a > span > span');

  await page.click('#j_idt29\\:j_idt31_menu > li:nth-child(3) > a > span > span');

  await page.waitForSelector('#frmPrincipal\\:txtCPF');

  const cpf = await page.evaluate(() => document.querySelector('#frmPrincipal\\:txtCPF').innerText);

  const name = await page.evaluate(() => document.querySelector('#frmPrincipal\\:txtNome').innerText);

  const email = await page.evaluate(() => document.querySelector('#frmPrincipal\\:txtEmailIdUffs').value);

  const idUffs = await page.evaluate(() => document.querySelector('#frmPrincipal\\:j_idt193_content > table:nth-child(1) > tbody > tr > td:nth-child(2) > input[type=text]').value);

  return {
    cpf, name: titleCase(name), email, idUffs,
  };
}

async function authenticate({ authenticator, password, imagePath }) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  const pageMoodle = await browser.newPage();

  const {
    cpf, name, email, idUffs,
  } = await fetchPortalData(page, authenticator, password);
  const relativePathUrl = await getUserImage(pageMoodle, idUffs, password, imagePath);

  await browser.close();

  return {
    cpf,
    name,
    email,
    idUffs,
    image: relativePathUrl,
  };
}

exports.tryLoginUffs = async ({ authenticator, password, imagePath }) => {
  try {
    return authenticate({
      authenticator,
      password,
      imagePath,
    });
  } catch (error) {
    return null;
  }
};
