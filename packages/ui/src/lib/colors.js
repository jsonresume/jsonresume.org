// @todo - anyone know how to make a modern color pallette?

const colors = Object.freeze({
  primary: {
    light: '#7986cb',
    main: '#3f51b5',
    dark: '#303f9f',
    contrastText: '#ffffff',
  },
  secondary: {
    light: '#ff4081',
    main: '#f50057',
    dark: '#c51162',
    contrastText: '#ffffff',
  },
  success: {
    light: '#81c784',
    main: '#4caf50',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  warning: {
    light: '#ffb74d',
    main: '#ff9800',
    dark: '#f57c00',
    contrastText: '#ffffff',
  },
  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd',
    hint: '#9e9e9e',
  },
});

export default colors;
