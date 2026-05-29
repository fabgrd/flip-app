import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [common, home, games, support] = await Promise.all([
    import(`./locales/${locale}/common.json`).then((m) => m.default),
    import(`./locales/${locale}/home.json`).then((m) => m.default),
    import(`./locales/${locale}/games.json`).then((m) => m.default),
    import(`./locales/${locale}/support.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages: {
      Common: common,
      Home: home,
      Games: games,
      Support: support,
    },
  };
});
