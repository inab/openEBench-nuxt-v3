export async function fetchAPI(name, URL, type, customBody) {
    console.log("tyoe", type)
    const { data: items, status } = await useAsyncData(name, async () => {
        const [items] = await Promise.all([
            $fetch(URL, {
                method: type,
                body: {
                    customBody
                }
            })
        ])
        return { items }
    })
}

export function graphApi(name, graph) {

}