import { fetchAPI } from "~/api/benchAPI";

export default defineNuxtPlugin(() => {
    const api = $fetch.create({
        headers: {
            Accept: 'text/plain, */*',
        },
    });

    return {
        provide: {
            api
        }
    }
});