import React from 'react';
import { render, screen, waitFor, fireEvent, act, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieDetailsModal from '../MovieDetailsModal';

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
        stills: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg'],
        posters: ['poster1.jpg']
    },
    videos: ['video1.mp4']
};

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockMovie)
        } as Response)
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('MovieDetailsModal', () => {
    test('renders basic movie information', async () => {
        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        expect(screen.getByText(/2023/)).toBeInTheDocument();
        expect(screen.getByText(/Test Country/)).toBeInTheDocument();
        expect(screen.getByText(/Test Language/)).toBeInTheDocument();
        expect(screen.getByText(/Test Company/)).toBeInTheDocument();
        expect(screen.getByText(/Director 1, Director 2/)).toBeInTheDocument();
        expect(screen.getByText(/Writer 1, Writer 2/)).toBeInTheDocument();
        expect(screen.getByText(/Actor 1, Actor 2/)).toBeInTheDocument();
        expect(screen.getByText(/Test Description/)).toBeInTheDocument();
    });

    test('handles API error gracefully', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
        global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(document.body.textContent).toBe('');
        });

        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    test('displays poster image', async () => {
        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        const posterImage = screen.getByAltText('Постер');
        expect(posterImage).toHaveAttribute('src', 'poster1.jpg');
    });

    test('displays placeholder when no poster available', async () => {
        const movieWithoutPoster = {
            ...mockMovie,
            images: {
                ...mockMovie.images,
                posters: []
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(movieWithoutPoster)
            } as Response)
        );

        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        const placeholderImage = screen.getByAltText('Постер');
        expect(placeholderImage).toHaveAttribute('src', '/images/placeholder.jpg');
    });

    test('displays initial set of images', async () => {
        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        const images = document.querySelectorAll('.movie-thumbnail');
        expect(images.length).toBe(5);
    });

    test('shows all images when "Show all" button is clicked', async () => {
        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        await act(async () => {
            const showAllButton = screen.getByText(/Показати всі/);
            fireEvent.click(showAllButton);
        });

        const allImages = document.querySelectorAll('.movie-thumbnail');
        expect(allImages.length).toBe(6);
    });

    test('uses cached data for subsequent requests', async () => {
        let component: RenderResult;
        await act(async () => {
            component = render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            component.rerender(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            component.rerender(<MovieDetailsModal movieId="456" onClose={() => { }} />);
        });

        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('displays "No images available" message when no images', async () => {
        const movieWithoutImages = {
            ...mockMovie,
            images: {
                stills: [],
                posters: []
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(movieWithoutImages)
            } as Response)
        );

        await act(async () => {
            render(<MovieDetailsModal movieId="123" onClose={() => { }} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Немає доступних зображень')).toBeInTheDocument();
        });
    });
});