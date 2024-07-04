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
    }
];