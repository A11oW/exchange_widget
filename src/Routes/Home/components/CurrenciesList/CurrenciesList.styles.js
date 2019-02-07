import styled, { css } from 'styled-components';
import { Link as LinkSource } from 'react-router-dom';

export const Box = styled.div`
  position: relative;
  height: 100vw;
`;

export const Inner = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  width: 280px;
  height: 280px;
  transform: translateX(-50%) translateY(-50%) rotateZ(90deg) rotateY(50deg);
`;

export const СurrencyWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 1px;
  border: 1px solid red
    ${({ index, deg }) => {
      return css`
        transform: rotate(${deg}deg) translate(140px) rotate(-${deg + 90}deg)
          rotateY(50deg);
      `;
    }}};
`;

export const Сurrency = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 2rem;
`;

export const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  padding-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Link = styled(LinkSource)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
`;

export const Button = styled.div`
  margin-bottom: 4px;
  width: 1em;
  height: 1em;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.6);
  font-size: 2em;
  border-radius: 100%;
  box-sizing: content-box;
`;
