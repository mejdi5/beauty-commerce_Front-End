import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartProduct } from "./cartSlice";

export interface OrderType {
    _id?: string | null,
    userId : string | null,
    products: CartProduct[] | never[],
    amount: number ,
    address: string ,
    status?: string,
    createdAt?: any,
    updatedAt?: any
}

interface State {
    order: OrderType | null,
    orders: OrderType[] | never[]
}

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        orders: []
    },
    reducers: {
    getOrder: (state: State, action: PayloadAction<OrderType | null>) => {
        state.order = action.payload
    },
    getOrders: (state: State, action: PayloadAction<OrderType[]>) => {
        state.orders = action.payload
    }
}})

const { actions, reducer } = orderSlice

export const { getOrder, getOrders } = actions;

export default reducer