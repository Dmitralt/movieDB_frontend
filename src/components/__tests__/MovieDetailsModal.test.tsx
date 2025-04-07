import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MovieDetailsModal from '../MovieDetailsModal';

// Мокаем fetch для тестов
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
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
        })
    })
) as jest.Mock;

describe('MovieDetailsModal', () => {
    const mockOnClose = jest.fn();
    const movieId = '123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    it('renders movie details after loading', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
            expect(screen.getByText('2023')).toBeInTheDocument();
            expect(screen.getByText('Test Country')).toBeInTheDocument();
            expect(screen.getByText('Test Language')).toBeInTheDocument();
            expect(screen.getByText('Test Company')).toBeInTheDocument();
            expect(screen.getByText('Director 1, Director 2')).toBeInTheDocument();
            expect(screen.getByText('Writer 1, Writer 2')).toBeInTheDocument();
            expect(screen.getByText('Actor 1, Actor 2')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
        });
    });

    it('handles image click to show full size', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const image = screen.getByAltText('Постер');
            fireEvent.click(image);
        });

        expect(screen.getByAltText('Полное изображение')).toBeInTheDocument();
    });

    it('handles video player toggle', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const toggleButton = screen.getByText('Показать видео');
            fireEvent.click(toggleButton);
        });

        expect(screen.getByText('Скрыть видео')).toBeInTheDocument();
    });

    it('handles video switching', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const toggleButton = screen.getByText('Показать видео');
            fireEvent.click(toggleButton);
        });

        const videoButtons = screen.getAllByText(/Видео \d+/);
        fireEvent.click(videoButtons[1]);

        await waitFor(() => {
            expect(screen.getByText('Видео 2')).toHaveClass('active');
        });
    });

    it('handles show more/less images toggle', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const showMoreButton = screen.getByText('Показать все (2 фото)');
            fireEvent.click(showMoreButton);
        });

        expect(screen.getByText('Свернуть (2 фото)')).toBeInTheDocument();
    });

    it('handles close button click', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const closeButton = screen.getByText('✕');
            fireEvent.click(closeButton);
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles link clicks', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const links = screen.getAllByRole('link');
            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute('href', 'http://test1.com');
            expect(links[1]).toHaveAttribute('href', 'http://test2.com');
        });
    });

    it('handles video controls', async () => {
        render(<MovieDetailsModal movieId={movieId} onClose={mockOnClose} />);

        await waitFor(() => {
            const toggleButton = screen.getByText('Показать видео');
            fireEvent.click(toggleButton);
        });

        const videoElement = screen.getByTestId('video-player');
        const playButton = screen.getByText('▶');

        fireEvent.click(playButton);
        expect(screen.getByText('⏸')).toBeInTheDocument();

        fireEvent.click(playButton);
        expect(screen.getByText('▶')).toBeInTheDocument();
    });
}); 