import React from 'react';
import styled from 'styled-components';
import InlineSVG from 'svg-inline-react';

const Icon = styled(props => <InlineSVG raw {...props} />)`
  fill: currentColor;
  width: 1em;
  height: 1em;
`;

export default Icon;
