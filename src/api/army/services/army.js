'use strict';

/**
 * army service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::army.army');
