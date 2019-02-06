import React from 'react';
import { inject } from 'mobx-react';

import { Box } from './Error.styled';

const Error = inject('store')(({ store }) => (
  <Box>
    <h3>🥺 Sorry, An error has occurred on the server.</h3>
    <a onClick={() => store.runFetchRates()}>Retry?</a>
  </Box>
));

export default Error;
