import { goodsService } from '../../services/goodsService';
import { createSagaSlice } from '../createSagaSlice';

const initialState = {
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  total: 0,
  category: 'all',
};

const { reducer, actions, saga } = createSagaSlice({
  name: 'goods',
  initialState,
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
    },
  },
  asyncReducers: {
    fetchGoods: {
      handler: async ({ page = 1, limit = 10, category = 'all', reset = false }, state) => {
        const result = await goodsService.fetchGoods({ 
          page, 
          limit, 
          category: reset ? state.goods.category : category 
        });
        return { ...result, reset, page };
      },
      onSuccess: (state, action) => {
        const { items, total, hasMore, reset, page } = action.payload;
        if (reset) {
          state.items = items;
          state.page = page;
        } else {
          state.items = [...state.items, ...items];
          state.page = page + 1;
        }
        state.total = total;
        state.hasMore = hasMore;
        state.error = null;
      },
    },
  },
});

export const { fetchGoods, setCategory, clearGoods } = actions;
export const goodsSaga = saga;
export default reducer;