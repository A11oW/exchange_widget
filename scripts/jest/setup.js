require('jest-styled-components');

const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');

// Make Enzyme functions available in all test files without importing.
Enzyme.configure({ adapter: new EnzymeAdapter() });

// Snapshot API
global.snapshot = {
    shallow: Enzyme.shallow, // shallow support all lifecycle
    render: Enzyme.render, // render only calls render but renders all children
    mount: Enzyme.mount, // mount support all lifecycle
};
