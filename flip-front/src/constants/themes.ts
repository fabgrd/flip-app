export type Theme = {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;

    background: string;
    surface: string;

    text: {
      primary: string;
      secondary: string;
      light: string;
      white: string;
    };

    button: {
      primary: string;
      secondary: string;
      disabled: string;
    };

    border: string;
    overlay: string;
  };
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#FF5B3A', // tomato
    secondary: '#4FCB8A', // mint
    accent: '#2447FF', // cobalt
    success: '#4FCB8A',
    warning: '#FFD23F', // lemon
    danger: '#FF5B3A',

    background: '#F5EFE3', // warm cream
    surface: '#FBF7EC', // paper

    text: {
      primary: '#181613', // ink
      secondary: '#3A342A', // inkSoft
      light: '#8B8273', // muted
      white: '#FFFFFF',
    },

    button: {
      primary: '#FF5B3A',
      secondary: '#4FCB8A',
      disabled: '#8B8273',
    },

    border: '#181613', // ink border for design system
    overlay: 'rgba(24,22,19,0.5)',
  },
};

