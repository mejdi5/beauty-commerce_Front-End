import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductImageType {
    _id?: string,
    productId: string,
    path: string
}

interface State {
    productImage: ProductImageType | null,
    productImages: ProductImageType[] | never[]
}

const productImageSlice = createSlice({
    name: 'productImage',
    initialState: {
        productImage: null,
        productImages: []
    },
    reducers: {
        getProductImage: (state: State, action: PayloadAction<ProductImageType | null>) => {
            state.productImage = action.payload
        },

        getAllProductImages: (state: State, action: PayloadAction<ProductImageType[] | never[]>) => {
            state.productImages = action.payload
        }
    }
})

const { actions, reducer } = productImageSlice


export const { getProductImage, getAllProductImages } = actions;

export default reducer