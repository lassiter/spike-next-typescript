

interface ContentfulAsset {
    id: string;
    contentType: string;
    url: string;
    title: string;
  }
  
class ContentfulAssetFactory {
  static create(asset: ContentfulAsset) {
      return {
        id: asset.id,
        contentType: asset.contentType,
        url: asset.url,
        title: asset.title
      }
  }
}


interface LandingPage {
  campaignTitle: string;
  promoCode: string;
  template: string;
  pageImages: Array<ContentfulAsset> | null;
  ctaPrimary: Object;
  ctaPrimaryButtonText: string;
  ctaPrimaryHyperlink: string;
  ctaAlt1: Object;
  ctaAlt1Hyperlink: string;
  ctaAlt1TextColor: string;
  ctaAlt1BackgroundColor: string;
}

class LandingPageFactory {
  static create(page: LandingPage, assets: Array<ContentfulAsset>) {
    // const pageImgs = page.pageImages.map(asset => {
    //   assets.find(item => {
    //     if (item.sys.id === asset.sys.id) {

    //     }
    //   })
    // })

    const lp = {
      campaignTitle: page.campaignTitle,
      promoCode: page.promoCode,
      template: page.template,
      ctaPrimary: page.ctaPrimary,
      ctaPrimaryButtonText: page.ctaPrimaryButtonText,
      ctaPrimaryHyperlink: page.ctaPrimaryHyperlink,
      ctaAlt1: page.ctaAlt1,
      ctaAlt1Hyperlink: page.ctaAlt1Hyperlink,
      ctaAlt1TextColor: page.ctaAlt1TextColor,
      ctaAlt1BackgroundColor: page.ctaAlt1BackgroundColor,
      pageImages: assets
    }
      return lp
  }
}

export {
  ContentfulAsset,
  ContentfulAssetFactory,
  LandingPage,
  LandingPageFactory
}