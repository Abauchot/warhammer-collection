'use strict';

/**
 * figurine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::figurine.figurine');
