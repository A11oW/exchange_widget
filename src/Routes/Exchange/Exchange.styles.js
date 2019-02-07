import styled from 'styled-components';
import { Link as LinkSource } from 'react-router-dom';

export const Box = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Half = styled.div`
  display: flex;
  flex: 1;
`;

export const CurrencyTop = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, #0f54d4 0%, #3479f9 100%);

  &:after {
    content: ' ';
    position: absolute;
    left: calc(50% - 20px);
    bottom: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;

    border-top: 20px solid #3479f9;
  }
`;
export const CurrencyBottom = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, #2259c3 0%, #1649a9 100%);
`;

export const LoaderCenter = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`;
