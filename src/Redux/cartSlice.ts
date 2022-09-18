import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "./productSlice";

export interface CartProduct {
    product: ProductType,
    productQuantity: number
}

export interface CartType {
    _id?: string | null,
    userId : string | null,
    cartProducts: CartProduct[] | never[],
    quantity: number ,
    total: number ,
    cratedAt?: any,
    updatedAt?: any
}

interface State {
    cart: CartType | null,
    carts: CartType[] | never[]
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: {
            _id: null,
            userId: null,
            cartProducts: [],
            quantity: 0,
            total: 0,
        },
        carts: []
    },
    reducers: {
    getUserCart: (state: State, action: PayloadAction<CartType>) => {
        state.cart = action.payload
    },
    getCarts: (state: State, action: PayloadAction<CartType[] | never[]>) => {
        state.carts = action.payload
    },
}})

const { actions, reducer } = cartSlice

export const { getUserCart, getCarts } = actions;

export default reducer