const Strapi = require('@strapi/strapi');
const path = require('path');

const strapiInstance = Strapi({
  distDir: path.resolve(__dirname, '../.strapi'),
  appDir: path.resolve(__dirname, '..'),
  autoReload: false,
});

strapiInstance.start(); 