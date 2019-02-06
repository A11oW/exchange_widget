import styled, { css } from 'styled-components';
import ReactSwipe from 'react-swipe';

export const Box = styled.div`
  position: relative;
`;

export const Slide = styled.div`
  height: 100%;
`;

export const Swipe = styled(ReactSwipe)`
  height: 100%;
`;

export const Points = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 36px;
  width: 100%;
  pointer-events: none;
`;

export const Point = styled.div`
  width: 8px;
  height: 8px;
  margin: 0 4px;
  border-radius: 100%;
  background: #fff;
  opacity: 0.8;
  
  ${({ active }) => active && css`
    opacity: 1;
  `}
`;
