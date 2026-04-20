import { apiSlice } from './apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders'],
            transformResponse: (response) => {
                // Убеждаемся, что всегда возвращаем объект с массивом orders
                return {
                    orders: Array.isArray(response.orders) ? response.orders : []
                };
            },
        }),
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useCreateOrderMutation,
} = ordersApi;