import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductType {
    _id?: string,
    title: string,
    description: string,
    image: string,
    categories: string[],
    price: number,
    inStock: boolean, 
    createdAt?: any,
    updatedAt?: any
}

interface State {
    products : ProductType[] | never[],
    allCategories: String[] | never[]
}

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        allCategories: []
    },
    reducers: {
    getProducts: (state: State, action: PayloadAction<ProductType[] | never[]>) => {
        state.products = action.payload
    },
    getAllCategories: (state: State, action: PayloadAction<string[] | never[]>) => {
        state.allCategories = action.payload
    }, 
    }
})

const { actions, reducer } = productSlice

export const { 
    getProducts,
    getAllCategories
} = actions;

export default reducer