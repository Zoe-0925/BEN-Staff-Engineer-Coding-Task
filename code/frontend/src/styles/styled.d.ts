import 'styled-components';

import type { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Theme['colors'];
    typography: Theme['typography'];
    spacing: Theme['spacing'];
    radii: Theme['radii'];
    sizes: Theme['sizes'];
    breakpoints: Theme['breakpoints'];
  }
}
