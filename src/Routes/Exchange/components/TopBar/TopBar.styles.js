import React from 'react';
import styled, { css } from 'styled-components';
import { Link as LinkSource } from 'react-router-dom';

export const Box = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 1;
`;

export const Link = styled(({ isRight, isLeft, ...rest }) => (
  <LinkSource {...rest} />
))`
  position: absolute;
  top: 0;
  ${({ isLeft }) =>
    isLeft &&
    css`
      left: 0;
    `}
  ${({ isRight }) =>
    isRight &&
    css`
      right: 0;
    `}
  padding: .6rem;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
`;

export const Rates = styled.div`
  margin-top: 1rem;
  width: 100%;
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
`;
