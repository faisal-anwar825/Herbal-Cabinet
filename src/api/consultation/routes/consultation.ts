export default {
  routes: [
    {
      method: 'GET',
      path: '/consultations',
      handler: 'consultation.find',
      config: { policies: ['api::consultation.is-expert'] },
    },
    {
      method: 'GET',
      path: '/consultations/:id',
      handler: 'consultation.findOne',
      config: { policies: ['api::consultation.is-expert'] },
    },
    {
      method: 'POST',
      path: '/consultations',
      handler: 'consultation.create',
      config: { policies: ['api::consultation.is-expert'] },
    },
    {
      method: 'PUT',
      path: '/consultations/:id',
      handler: 'consultation.update',
      config: { policies: ['api::consultation.is-expert'] },
    },
    {
      method: 'DELETE',
      path: '/consultations/:id',
      handler: 'consultation.delete',
      config: { policies: ['api::consultation.is-expert'] },
    },
  ],
};