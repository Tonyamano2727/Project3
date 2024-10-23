import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncAction'
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn:false,
    current : null,
    token:null,
    isLoading:false,
    currentCart:[]
  },
  reducers: {
    login: (state, action) => {
      
        state.isLoggedIn = action.payload.isLoggedIn
        state.token = action.payload.token
    },
    logout: (state, action) => {
      state.isLoggedIn  = false
      state.current = null
      state.token = null
      state.isLoading = false
    },
    updateCart: (state , action)  => {
        const {pid , color , quantity} = action.payload
        const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
        state.currentCart = updatingCart.map(el => {
          if (el.color === color && el.product?._id === pid){
            return {...el ,quantity}
          }else return el
          
        })
    }
  },
  extraReducers: (builder) => {
    // // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(actions.getCurrent.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action login thành công (Promise fulfilled)
    // builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
    //   // Tắt trạng thái loading, lưu thông tin user vào store
    //   state.isLoading = false;
    //   state.current = action.payload;
    //   state.isLoggedIn = true
    //   state.currentCart =  action.payload.cart
    // });
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false;
      state.current = action.payload;
      state.isLoggedIn = true;
      
      // Kiểm tra action.payload tồn tại và chứa thuộc tính 'cart' không trước khi gán giá trị
      if (action.payload && action.payload.cart) {
        state.currentCart = action.payload.cart;
      } else {
        state.currentCart = [];
      }
    });

    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.current = null;
    });
  },

})
export const {login,logout,updateCart } = userSlice.actions

export default userSlice.reducer