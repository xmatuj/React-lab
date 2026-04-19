import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchGoods = createAsyncThunk(
    'goods/fetchGoods',
    async ({ page = 1, limit = 10, category = 'all', reset = false }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/goods`, {
                params: {
                    page,
                    limit,
                    category: category !== 'all' ? category : undefined
                }
            });
            
            return {
                ...response.data,
                reset
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки товаров');
        }
    }
);

const goodsSlice = createSlice({
    name: 'goods',
    initialState: {
        items: [],
        loading: false,
        error: null,
        hasMore: true,
        page: 1,
        total: 0,
        category: 'all'
    },
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
            state.items = [];
            state.page = 1;
            state.hasMore = true;
        },
        clearGoods: (state) => {
            state.items = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoods.fulfilled, (state, action) => {
                const { items, total, hasMore, reset } = action.payload;
                
                state.items = reset ? items : [...state.items, ...items];
                state.total = total;
                state.hasMore = hasMore;
                state.loading = false;
                state.error = null;
                if (reset) {
                    state.page = 1;
                } else {
                    state.page += 1;
                }
            })
            .addCase(fetchGoods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCategory, clearGoods } = goodsSlice.actions;
export default goodsSlice.reducer;