import { resolve } from 'path'

export const customRoutes = [
    {
        name: 'scientific-community',
        path: '/scientific/:community',
        file: resolve(__dirname, 'pages/benchmarking/community')
    },
    {
        name: 'benchmarking-community',
        path: '/benchmarking/:community',
        file: resolve(__dirname, 'pages/benchmarking/community')
    },
    {
        name: 'scientific-community-challenge',
        path: '/benchmarking/:community/:challenge',
        file: resolve(__dirname, 'pages/benchmarking/community/challenge')
    },
    {
        name: 'scientific-community-challenge-participants',
        path: '/benchmarking/:community/:id/participants',
        file: resolve(__dirname, 'pages/benchmarking/community/challenge/participants')
    }
];