import { asset } from './products';

const siteAssets = {
  logo: asset('/images/radiant-logo-transparent.png'),
  heroModel: asset('/images/radiant-hero-psalm-rooftop.png'),
  storyModels: asset('/images/radiant-editorial-03.png'),
  lookbookTees: asset('/images/radiant-editorial-02.png'),
  communityModels: asset('/images/radiant-editorial-05.png'),
  dropHero: asset('/images/radiant-editorial-07.png'),
  aboutHero: asset('/images/radiant-editorial-01.png'),
  missionHero: asset('/images/radiant-editorial-08.png'),
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
