import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Prefixes accepted as deep links into the app.
// - `flip://...` is the custom scheme declared in app.json.
// - The HTTPS prefixes are placeholders for future Universal Links / App Links.
//   They only activate once associated domains are configured server-side
//   (apple-app-site-association on iOS, assetlinks.json on Android).
const PREFIXES = [
  'flip://',
  'https://flipgame.app',
  'https://www.flipgame.app',
];

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: PREFIXES,
  config: {
    screens: {
      Home: '',
      GameSelect: 'game-select',
      Settings: 'settings',
      PurityTest: 'purity-test',
      PurityResults: 'purity-results',
      Cameleon: 'cameleon',
      CameleonResults: 'cameleon-results',
      LeftRight: 'left-right',
      LeftRightResults: 'left-right-results',
      Paranoia: 'paranoia',
      Medusa: 'medusa',
      Apero: 'apero',
      Casting: 'casting',
      RedFlag: 'red-flag',
    },
  },
};
