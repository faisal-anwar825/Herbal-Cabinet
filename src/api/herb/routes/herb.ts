export default {
  routes: [
    {
      method: 'GET',
      path: '/herbs',
      handler: 'herb.find'
    },
    {
      method: 'GET',
      path: '/herbs/:slug', // was :id
      handler: 'herb.findOne'
    },
    {
      method: 'POST',
      path: '/herbs',
      handler: 'herb.create'
    },
    {
      method: 'PUT',
      path: '/herbs/:slug', // was :id
      handler: 'herb.update'
    },
    {
      method: 'DELETE',
      path: '/herbs/:slug', // was :id
      handler: 'herb.delete'
    }
  ]
}