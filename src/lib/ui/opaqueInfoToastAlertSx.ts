import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Shared style for informational Snackbar + Alert toasts:
 * opaque light-orangish surface (no bleed-through), readable brown text, soft shadow.
 */
export const opaqueInfoToastAlertSx: SxProps<Theme> = {
    width: '100%',
    maxWidth: 560,
    borderRadius: '10px',
    alignItems: 'flex-start',
    backgroundColor: '#fff3e8',
    backgroundImage: 'none',
    border: '1px solid #ffcba4',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
    color: '#3e2723',
    '& .MuiAlert-message': {
        fontSize: '0.9375rem',
        lineHeight: 1.5,
        fontWeight: 500,
        color: '#4e342e',
    },
    '& .MuiAlert-icon': {
        color: '#d84315',
        alignSelf: 'flex-start',
    },
};
