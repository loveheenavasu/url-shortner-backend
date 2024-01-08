"use strict";

/**
 *  shortner controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shortner.shortner",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        let { query } = ctx;
        const user = ctx.state.user;
        let entity;
        if (user) {
          // @ts-ignore
          query = { user: { $eq: user.id }, id: id };
        } else {
          query = { shortAlias: query.alias };
          entity = await strapi
            .service("api::shortner.shortner")
            .find({ filters: query });
        }
        entity = await strapi
          .service("api::shortner.shortner")
          .find({ filters: query });

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error(error);
        // @ts-ignore
        return ctx.response.badRequest("Failed to fetch entities");
      }
    },

    async create(ctx) {
      try {
        // @ts-ignore
        const { data } = ctx.request.body;
        // Remove 'id' property if present
        delete data.id;
        // Check if 'publishedAt' property exists and remove it
        if (data.hasOwnProperty("publishedAt")) {
          delete data.publishedAt;
        }
        // Assuming 'strapi.service' returns a promise
        const entity = await strapi
          .service("api::shortner.shortner")
          .create({ data });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        // Handle errors appropriately
        console.error(error);
        // @ts-ignore
        return ctx.response.badRequest("Failed to create entity");
      }
    },

    async delete(ctx) {
      let { id } = ctx.params;
      const user = ctx.state.user;
      let entity;
      let query = { user: { $eq: user.id }, id: { $eq: id } };
      entity = await strapi
        .service("api::shortner.shortner")
        .find({ filters: query });
      if (entity.results.length === 0) {
        // @ts-ignore
        return ctx.badRequest(null, [
          { messages: [{ id: "You can delete someone else content" }] },
        ]);
      }
      entity = await strapi.service("api::shortner.shortner").delete(id);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  })
);
