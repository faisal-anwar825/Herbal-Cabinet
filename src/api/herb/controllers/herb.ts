import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::herb.herb', ({ strapi }) => ({

    async findOne(ctx: Context) {
        const { slug } = ctx.params as { slug: string };

        const entity = await strapi.documents('api::herb.herb').findFirst({
            filters: { herbId: slug },
            populate: ctx.query.populate as any || '*'
        });

        if (!entity) {
            return ctx.notFound('Herb not found');
        }

        return this.transformResponse(entity);
    },

    async update(ctx: Context) {
        const { slug } = ctx.params as { slug: string };

        const herb = await strapi.documents('api::herb.herb').findFirst({
            filters: { herbId: slug }
        });

        if (!herb) return ctx.notFound('Herb not found');

        // Core update expects documentId in params.id
        ctx.params.id = herb.documentId;
        return super.update(ctx);
    },

    async delete(ctx: Context) {
        const { slug } = ctx.params as { slug: string };

        const herb = await strapi.documents('api::herb.herb').findFirst({
            filters: { herbId: slug }
        });

        if (!herb) return ctx.notFound('Herb not found');

        ctx.params.id = herb.documentId;
        return super.delete(ctx);
    }
}));