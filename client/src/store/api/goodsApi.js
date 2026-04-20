import { apiSlice } from './apiSlice';

export const goodsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGoods: builder.query({
            query: ({ page = 1, limit = 10, category = 'all' }) => ({
                url: '/goods',
                params: {
                    page,
                    limit,
                    category: category !== 'all' ? category : undefined,
                },
            }),
            providesTags: ['Goods'],
        }),
    }),
});

export const { useGetGoodsQuery } = goodsApi;