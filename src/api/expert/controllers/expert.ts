import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { validateRegisterExpert } from '../utils/validate-register';

export default factories.createCoreController('api::expert.expert', ({ strapi }) => ({

    async register(ctx: Context) {
        let data;
        try {
            data = await validateRegisterExpert(ctx.request.body);
        } catch (e) {
            return ctx.badRequest(e.message);
        }

        const {
            email, password, username, firstName, lastName, phoneNumber,
            address, city, state, country, zipcode, image,
            ...expertData
        } = data;

        try {
            const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { $or: [{ email }, { username }] }
            });
            if (existingUser) {
                return ctx.badRequest('Email or username already exists');
            }

            const expertRole = await strapi.db.query('plugin::users-permissions.role').findOne({
                where: { type: 'authenticated' }
            });

            const user = await strapi.plugin('users-permissions').service('user').add({
                username,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                city,
                state,
                country,
                zipcode,
                image,
                role: expertRole.id,
                confirmed: true,
                blocked: false,
                provider: 'local'
            });

            const expert = await strapi.documents('api::expert.expert').create({
                data: {
                    ...expertData,
                    user: user.id,
                },
                populate: ['user']
            });

            const jwt = strapi.plugin('users-permissions').service('jwt').issue({
                id: user.id
            });

            return ctx.send({ jwt, user, expert });

        } catch (e) {
            strapi.log.error(e);
            return ctx.internalServerError('Registration failed');
        }
    }
}));