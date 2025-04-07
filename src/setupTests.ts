import '@testing-library/jest-dom';

// Устанавливаем переменные окружения
process.env.REACT_APP_API_URL = 'http://localhost:3000';

// Определяем моковые данные
const mockMovie = {
    title: 'Test Movie',
    year: 2023,
    country: 'Test Country',
    language: 'Test Language',
    production_company: 'Test Company',
    directors: ['Director 1', 'Director 2'],
    screenwriters: ['Writer 1', 'Writer 2'],
    actors: ['Actor 1', 'Actor 2'],
    description: 'Test Description',
    images: {
        stills: ['image1.jpg', 'image2.jpg'],
        posters: ['poster1.jpg']
    },
    videos: ['video1.mp4', 'video2.mp4'],
    links: [
        { description: 'Link 1', url: 'http://test1.com' },
        { description: 'Link 2', url: 'http://test2.com' }
    ]
};

// Мокаем fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMovie)
    })
) as jest.Mock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    writable: true,
    value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    writable: true,
    value: jest.fn(),
});