import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::consultation.consultation', ({ strapi }) => ({

    async find(ctx) {
        const expert = ctx.state.expert;

        const results = await strapi.documents('api::consultation.consultation').findMany({
            filters: {
                expert: { documentId: expert.documentId }
            },
            ...ctx.query,
        });

        const sanitized = await this.sanitizeOutput(results, ctx);
        return this.transformResponse(sanitized); // no pagination meta
    },

    async findOne(ctx) {
        const expert = ctx.state.expert;
        const { id } = ctx.params;

        const entity = await strapi.documents('api::consultation.consultation').findOne({
            documentId: id,
            populate: { expert: { fields: ['documentId'] } },
        });

        if (!entity || entity.expert?.documentId !== expert.documentId) {
            return ctx.notFound('Consultation not found');
        }

        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
    },

    async create(ctx) {
        const expert = ctx.state.expert;
        ctx.request.body.data.expert = expert.documentId;

        // Use documents API to skip validation issues
        const entity = await strapi.documents('api::consultation.consultation').create({
            data: ctx.request.body.data,
            ...ctx.query,
        });

        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
    },

    // update/delete same pattern - check ownership then use documents API
    async update(ctx) {
        const expert = ctx.state.expert;
        const { id } = ctx.params;

        const existing = await strapi.documents('api::consultation.consultation').findOne({
            documentId: id,
            populate: { expert: { fields: ['documentId'] } },
        });

        if (!existing || existing.expert?.documentId !== expert.documentId) {
            return ctx.forbidden('You can only update your own consultations');
        }

        delete ctx.request.body.data.expert; // prevent ownership transfer

        const entity = await strapi.documents('api::consultation.consultation').update({
            documentId: id,
            data: ctx.request.body.data,
            ...ctx.query,
        });

        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
    },

    async delete(ctx) {
        const expert = ctx.state.expert;
        const { id } = ctx.params;

        const existing = await strapi.documents('api::consultation.consultation').findOne({
            documentId: id,
            populate: { expert: { fields: ['documentId'] } },
        });

        if (!existing || existing.expert?.documentId !== expert.documentId) {
            return ctx.forbidden('You can only delete your own consultations');
        }

        const entity = await strapi.documents('api::consultation.consultation').delete({
            documentId: id,
        });

        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
    },
}));