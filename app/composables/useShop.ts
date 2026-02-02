export const useShop = () => {
    const config = useRuntimeConfig()

    const { data: shop } = useFetch<Shop>(`${config.public.apiUrl}/api/shops/my`, {
        credentials: 'include'
    })
    return shop
}
