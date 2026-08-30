import styled from 'styled-components';

import type { Field } from '../schemas/Field';

type GridItemProps = {
  $width: Field['width'];
};

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: ${({ theme }) => theme.spacing.section};
`;

export const GridItem = styled.div<GridItemProps>`
  grid-column: span ${({ $width }) => $width.xs};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    grid-column: span ${({ $width }) => $width.md};
  }
`;
