module.exports = {
  routes: [
    // disable default CRUD
    // add only what you need
    {
      method: 'GET',
      path: '/experts',
      handler: 'expert.find',
      config: { auth: false }
    },
    {
      method: 'POST',
      path: '/expert/register',
      handler: 'expert.register',
      config: { auth: false }
    },
    // {
    //   method: 'GET', 
    //   path: '/expert/me',
    //   handler: 'expert.me',
    //   config: { auth: {} } // requires login
    // }
  ]
}