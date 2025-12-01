// src/theme/colors.ts
// 🎨 Sistema de cores moderno e vibrante

export const colors = {
  // Backgrounds
  background: '#0a0e27',      // Azul escuro profundo
  backgroundAlt: '#0f1535',   // Azul escuro alternativo
  card: '#151b3d',            // Card com azul mais claro
  cardHover: '#1a2147',       // Card hover state
  
  // Primary Colors
  primary: '#6366f1',         // Indigo vibrante
  primaryDark: '#4f46e5',     // Indigo mais escuro
  primaryLight: '#818cf8',    // Indigo claro
  primarySoft: '#4338ca',     // Indigo suave
  
  // Accent & Success
  accent: '#10b981',          // Verde esmeralda
  accentLight: '#34d399',     // Verde claro
  success: '#22c55e',         // Verde sucesso
  
  // Text Colors
  text: '#f0f4f8',            // Branco gelo
  textSecondary: '#cbd5e1',   // Cinza claro
  textMuted: '#94a3b8',       // Cinza médio
  textDim: '#64748b',         // Cinza escuro
  
  // Status Colors
  danger: '#ef4444',          // Vermelho vibrante
  dangerLight: '#f87171',     // Vermelho claro
  warning: '#f59e0b',         // Âmbar
  warningLight: '#fbbf24',    // Âmbar claro
  info: '#3b82f6',            // Azul info
  
  // Borders & Inputs
  border: '#1e293b',          // Borda sutil
  borderLight: '#334155',     // Borda mais visível
  inputBg: '#1e2748',         // Background de input
  inputBorder: '#2d3b5f',     // Borda de input
  inputFocus: '#6366f1',      // Borda quando focado
  
  // Shadows (para uso com style shadows)
  shadowColor: '#000',
  shadowPrimary: '#6366f1',
  
  // Grades/Pills
  gradeExcellent: '#10b981',  // Verde - Aprovado
  gradeGood: '#3b82f6',       // Azul - Bom
  gradeWarning: '#f59e0b',    // Âmbar - Exame
  gradeFail: '#ef4444',       // Vermelho - Reprovado
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.75)',
  shimmer: 'rgba(255, 255, 255, 0.1)',
  white: '#ffffff',
  black: '#000000',
};

// 🎨 Sombras pré-definidas para consistência
export const shadows = {
  small: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6.27,
    elevation: 8,
  },
  primaryGlow: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
};

// 🎨 Espaçamentos consistentes
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// 🎨 Bordas/Raios
export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};