const {
  createLandingPageRoutes,
} = require('./lib/routes');

module.exports = async (_defaultPathMap, buildVars) => {
  const lpPaths = await createLandingPageRoutes();

  return {
    '/': { page: '/index' },
    ...lpPaths,
  };
};
