import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
    _id?: string,
    firstName: string,
    lastName: string | undefined,
    email: string,
    password: string,
    isAdmin?: Boolean,
    verified?: Boolean,
}

interface State {
    token: String | null,
    msg: String | null,
    user: UserType | null,
    isLoading: Boolean,
    users: UserType[] | never[]
}


const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token'), 
        msg: null,
        user: null, 
        isLoading: false,
        users: []
    },
    reducers: {
        authStart : (state: State) => {
            state.isLoading = true;
        },
        loginSuccess : (state: State, action: PayloadAction<any>) => {
            localStorage.setItem('token', action.payload.token);
            state.isLoading = false
            state.user = action.payload.user;
            state.msg = action.payload.msg;
        },
        registerSuccess : (state: State, action: PayloadAction<any>) => {
            localStorage.setItem('token', action.payload.token);
            state.isLoading = false;
            state.user = action.payload.savedUser;
            state.msg = action.payload.msg;
        },
        authFailure : (state: State) => {
            state.isLoading = false
            state.msg = "Something went wrong"
        },

        getVerifiedUser: (state: State, action: PayloadAction<any>) => {
            state.user = action.payload
        },
        
        logoutUser: (state: State) => {
            localStorage.removeItem('token');
            state.isLoading = false;
            state.token = null;
            state.user = null
        },

        getAllUsers: (state: State, action: PayloadAction<UserType[]>) => {
            state.users = action.payload
        },
    
        getOneUser: (state: State, action: PayloadAction<UserType>) => {
            state.user = action.payload
        }
    }
})

const { actions, reducer } = userSlice


export const { authStart,
    loginSuccess,
    registerSuccess,
    authFailure,
    getVerifiedUser,
    logoutUser,
    getAllUsers,
    getOneUser
} = actions;

export default reducer




