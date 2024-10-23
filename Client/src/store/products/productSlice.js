import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncAction'
import { getNewProducts } from "./asyncAction";

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    newProducts:null,
    errorMessage: '',
    
  },
  reducers: {
   
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(getNewProducts.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false;
      state.categories = action.payload;
    });

    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(getNewProducts.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
})
// export const { } = productSlice.actions

export default productSlice.reducer