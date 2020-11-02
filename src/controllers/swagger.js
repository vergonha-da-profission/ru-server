const fs = require('fs');
const yamljs = require('js-yaml');

exports.convertYamltoJson = () => {
  const swaggerYamlFile = (`${__dirname}/docs/ru.yml`.replace('/src/controllers', ''));
  const swaggerJsFile = (`${__dirname}/docs/ru.json`.replace('/src/controllers', ''));
  fs.writeFileSync(swaggerJsFile, JSON.stringify(yamljs.load(fs.readFileSync(swaggerYamlFile, { encoding: 'utf-8' })), null, 2));
};
