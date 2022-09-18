import axios from 'axios'

const baseUrl = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://beauty-commerce.herokuapp.com"

export const axiosInstance = axios.create({
    baseURL: baseUrl
})

