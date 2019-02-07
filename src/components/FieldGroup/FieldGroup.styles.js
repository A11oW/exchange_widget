import styled, { css } from 'styled-components';

export const Box = styled.label`
  height: 50vh;
  display: flex;
  align-items: center;
`;

export const Label = styled.div`
  padding: 1.2rem;
  color: #fff;
  font-size: 3rem;
`;

export const Value = styled.input`
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: none;

  width: 100%;
  padding: 1.2rem;
  ${({ fontsize }) =>
    css`
      font-size: ${fontsize}rem;
    `};
  text-align: right;
  color: #fff;
`;

export const PocketCount = styled.div`
  position: absolute;
  bottom: 90px;
  font-size: 0.8rem;
  color: #fff;
  opacity: 0.8;
  padding: 1.2rem;
`;
