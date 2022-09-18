import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageType {
    _id?: string,
    userId: string,
    path: string
}

interface State {
    image: ImageType | null,
    images: ImageType[] | never[]
}

const imageSlice = createSlice({
    name: 'userImage',
    initialState: {
        image: null,
        images: []
    },
    reducers: {
        getImage: (state: State, action: PayloadAction<ImageType | null>) => {
            state.image = action.payload
        },

        getAllImages: (state: State, action: PayloadAction<ImageType[] | never[]>) => {
            state.images = action.payload
        }
    }
})

const { actions, reducer } = imageSlice


export const { getImage, getAllImages } = actions;

export default reducer