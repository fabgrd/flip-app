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
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#45B7D1',
        success: '#96CEB4',
        warning: '#FFEAA7',
        danger: '#FD79A8',

        background: '#FFFFFF',
        surface: '#F8F9FA',

        text: {
            primary: '#2D3436',
            secondary: '#636E72',
            light: '#DDD',
            white: '#FFFFFF',
        },

        button: {
            primary: '#FF6B6B',
            secondary: '#4ECDC4',
            disabled: '#B2BEC3',
        },

        border: '#E0E0E0',
        overlay: 'rgba(0,0,0,0.4)',
    },
};

export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#45B7D1',
        success: '#8BC6A9',
        warning: '#FFDE7A',
        danger: '#FF8FB4',

        background: '#111315',
        surface: '#1A1D1F',

        text: {
            primary: '#EAECEF',
            secondary: '#A1A6AB',
            light: '#6B7176',
            white: '#FFFFFF',
        },

        button: {
            primary: '#FF6B6B',
            secondary: '#4ECDC4',
            disabled: '#3A3F44',
        },

        border: '#2A2F34',
        overlay: 'rgba(0,0,0,0.6)',
    },
}; 