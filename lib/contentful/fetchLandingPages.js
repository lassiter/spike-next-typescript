const factory = require('./factory');
const client = require('./client');

const LANDING_PAGE_CONTENT_TYPE_ID = 'campaignLandingPage';

module.exports = async () => {
  const entries = await client.getEntries({
    content_type: LANDING_PAGE_CONTENT_TYPE_ID,
  });

  const linkedAssets = await entries.includes.Asset.map(asset =>
    factory.ContentfulAssetFactory.create(asset.fields)
  );

  const items = entries.items.map(item =>
    factory.LandingPageFactory.create(item.fields, linkedAssets)
  );

  return items;
};
