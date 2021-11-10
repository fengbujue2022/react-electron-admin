import { ThemeOptions } from '@mui/material';
import tinycolor from 'tinycolor2';

const primary = '#536DFE';
const secondary = '#FF4081';
const warning = '#FFC260';
const success = '#3CD4A0';
const info = '#9013FE';

const lightenRate = 7.5;
const darkenRate = 15;

const defaultTheme: ThemeOptions = {
  palette: {
    primary: {
      main: primary,
      light: tinycolor(primary).lighten(lightenRate).toHexString(),
      dark: tinycolor(primary).darken(darkenRate).toHexString(),
    },
    secondary: {
      main: secondary,
      light: tinycolor(secondary).lighten(lightenRate).toHexString(),
      dark: tinycolor(secondary).darken(darkenRate).toHexString(),
      contrastText: '#FFFFFF',
    },
    warning: {
      main: warning,
      light: tinycolor(warning).lighten(lightenRate).toHexString(),
      dark: tinycolor(warning).darken(darkenRate).toHexString(),
    },
    success: {
      main: success,
      light: tinycolor(success).lighten(lightenRate).toHexString(),
      dark: tinycolor(success).darken(darkenRate).toHexString(),
    },
    info: {
      main: info,
      light: tinycolor(info).lighten(lightenRate).toHexString(),
      dark: tinycolor(info).darken(darkenRate).toHexString(),
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#6E6E6E',
      disabled: '#B9B9B9',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: '#4A4A4A1A',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow:
            '0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#B9B9B9',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&$selected': {
            backgroundColor: '#F3F5FF !important',
            '&:focus': {
              backgroundColor: '#F3F5FF',
            },
          },
        },
        button: {
          '&:hover, &:focus': {
            backgroundColor: '#F3F5FF',
          },
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: {
        child: {
          backgroundColor: 'white',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: 56,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, .5)',
          paddingLeft: 24,
        },
        head: {
          fontSize: '0.95rem',
        },
        body: {
          fontSize: '0.95rem',
        },
      },
    },
  },
};

export default defaultTheme;
