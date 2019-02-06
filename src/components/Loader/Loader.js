import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-sizing: border-box;
  vertical-align: middle;
  display: inline-block;
  padding-top: 32px;
  min-width: 32px;
  font-size: 14px;
  
  &:after {
    content: ' ';
    position: absolute;
    box-sizing: border-box;
    top: 0px;
    left: 50%;
    height: 32px;
    width: 32px;
    margin-left: -16px;
    border-width: 4px;
    border-style: solid;
    border-color: rgb(255, 237, 0) rgb(255, 255, 255) rgb(255, 255, 255) rgb(255, 237, 0);
    border-image: initial;
    border-radius: 50%;
    animation: ${rotate360} 1.2s linear 0s infinite normal none running;
  }
`;

export default Loader;
