const darkColors = {
    background: '#020617',
    surface: 'rgba(30, 41, 59, 0.95)',
    primary: '#38bdf8',
    accent: '#818cf8',
    textMain: '#f1f5f9',
    textSub: '#94a3b8',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
};


const lightColors = {
    background: '#F8FAFC',
    surface: 'rgba(255, 255, 255, 0.9)',
    primary: '#007AFF',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textSub: '#64748B',
    glassBorder: 'rgba(255, 255, 255, 0.7)',
};

export const COLORS = darkColors;
export const getLightColors = () => lightColors;

export const SPACING = {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20
};

export const FONTS = {
    bold: '900', semiBold: '800', lightBold: '600',
    lineHeight: 20, standard: 16, small: 12,
    large: 20, xxlarge: 32, inputHeight: 55
};