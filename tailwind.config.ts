import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                customPrimary: {
                    50: '#0b579f',
                    100: '#0b579f',
                    200: '#0b579f',
                    300: '#0b579f',
                    400: '#0b579f',
                    500: '#0b579f',
                    600: '#0b579f',
                    700: '#0b579f',
                    800: '#0b579f',
                    900: '#0b579f',
                    950: '#0b579f',
                },
                customSecondary: {
                    50: '#f47c21',
                    100: '#f47c21',
                    200: '#f47c21',
                    300: '#f47c21',
                    400: '#f47c21',
                    500: '#f47c21',
                    600: '#f47c21',
                    700: '#f47c21',
                    800: '#f47c21',
                    900: '#f47c21',
                    950: '#f47c21',
                }
            }
        }
    }
}