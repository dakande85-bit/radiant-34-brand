import { asset } from './products';

const siteAssets = {
  logo: asset('/images/radiant-logo-transparent.png'),
  heroModel: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-hero.webp?v=1785331751',
  storyModels: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-dress.webp?v=1785331796',
  lookbookTees: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-male.webp?v=1785331768',
  communityModels: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-female.webp?v=1785331783',
  dropHero: asset('/images/radiant-editorial-07.png'),
  aboutHero: asset('/images/radiant-editorial-01.png'),
  missionHero: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-home-female.webp?v=1785331783',
  contactHero: asset('/images/radiant-editorial-10.png'),
  lookbook: [
    asset('/images/radiant-editorial-01.png'),
    asset('/images/radiant-editorial-02.png'),
    asset('/images/radiant-editorial-03.png'),
    asset('/images/radiant-editorial-04.png'),
    asset('/images/radiant-editorial-05.png'),
    asset('/images/radiant-editorial-06.png'),
    asset('/images/radiant-editorial-07.png'),
    asset('/images/radiant-editorial-08.png'),
    asset('/images/radiant-editorial-09.png'),
    asset('/images/radiant-editorial-10.png'),
  ],
} as const;

export default siteAssets;