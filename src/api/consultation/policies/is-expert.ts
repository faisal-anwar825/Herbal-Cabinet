export default async (ctx, config) => {
  const { user } = ctx.state;
  if (!user) return ctx.unauthorized();

  const expert = await strapi.documents('api::expert.expert').findFirst({
    filters: { user: { id: user.id } },
    fields: ['id', 'documentId']
  });

  if (!expert) return ctx.forbidden('You are not an expert');

  // Attach expert so controller can use it
  ctx.state.expert = expert;
  return true;
};