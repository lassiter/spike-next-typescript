const {
  fetchLandingPages,
} = require('./contentful');

// generates a slashed and unslashed route for each path
const addRoute = (routes, path, route) => ({
  ...routes,
  [path]: route,
  [`${path}/`]: route,
});

const addRoutePair = (routes, [path, route]) => addRoute(routes, path, route);
const addRoutes = (routes, pairs) => pairs.reduce(addRoutePair, routes);

module.exports = {
  createLandingPageRoutes: async () => {
    const lpDocs = await fetchLandingPages();
    const routes = lpDocs
      .map(doc => {
        const { promoCode } = doc;
        const route = addRoute({}, `/lp/${promoCode}`, {
          page: '/lp',
          query: { ...doc },
        });

        return route;
      })
      .reduce(
        (all, route) => ({
          ...all,
          ...route,
        }),
        {}
      );

    return { ...routes };
  },

  // exported for testing purposes
  addRoute,
  addRoutePair,
  addRoutes,
};
