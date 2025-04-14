import '@testing-library/jest-dom';

process.env.REACT_APP_API_URL = 'http://localhost:3000';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// Mock video element methods
const videoMethods = {
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn(),
    load: jest.fn()
};

// Apply mocks to HTMLVideoElement prototype
Object.defineProperties(window.HTMLVideoElement.prototype, {
    play: { value: videoMethods.play },
    pause: { value: videoMethods.pause },
    load: { value: videoMethods.load }
});