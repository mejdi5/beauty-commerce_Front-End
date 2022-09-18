import React,{useEffect, useState} from 'react'
import './Products.css'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getProducts } from '../../Redux/productSlice';
import { ProductType } from '../../Redux/productSlice'
import { useParams, Link } from 'react-router-dom'
import { axiosInstance } from '../../axiosInstance';
import {UserType} from "../../Redux/userSlice"
import {getAllProductImages, ProductImageType} from '../../Redux/productImageSlice'

interface Props {
    filterProductsWord: string,
    sort: string,
}

const Products : React.FC<Props> = ({filterProductsWord, sort}) => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
    const dispatch = useTypedDispatch()
    const category = useParams().category
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (category) {
                    const res = await axiosInstance.get(`/api/products?category=${category}`);
                    dispatch(getProducts(res.data));
                } else {
                    const res = await axiosInstance.get(`/api/products`);
                    dispatch(getProducts(res.data));
                }
            } catch (error: any) {
                console.log(error)
            }}
            fetchProducts();
    }, [category])

    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                const res = await axiosInstance.get("/api/product-images"); 
                dispatch(getAllProductImages(res.data));
            } catch (error: any) {
                console.log(error)
            }}
            fetchProductImages();
    }, [])
    

    //filter products by title or category
    let filteredProducts: ProductType[] | never[] = []
    filteredProducts = (products && Array.isArray(products) && products?.length > 0)
        ?
        products?.filter(product => 
            product.categories.some(cat => cat.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim())) 
            || 
            product.title.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim()))
        : []

    if ((!category && !user?.isAdmin)) {
        filteredProducts = filteredProducts && filteredProducts.slice(0,6)
    }

    //sort products
    let sortedProducts: ProductType[] | never[] = []
    if (sort === "price") {
        sortedProducts = filteredProducts?.length > 0 ? filteredProducts?.sort((a: ProductType, b: ProductType) => a?.price - b?.price) : []
    } else if (sort === "alphabetical order") {
        sortedProducts = filteredProducts?.length > 0 ? filteredProducts?.sort((a: ProductType, b: ProductType) => a?.title?.toLowerCase()?.localeCompare(b?.title)) : []
    } else {
        sortedProducts = filteredProducts
    }

return (
<div className='products-container row-md-8'>
    {sortedProducts?.length > 0 && sortedProducts.map((product:ProductType, index: number ) => {
        const productImage = productImages.find((img: ProductImageType) => img?.productId === product?._id)
    return (
        <div className='product-wrapper' key={index}>
            <small className='product-categories'>{product.categories.join(' / ').toUpperCase()}</small>
            <div className='product-title'>{product.title}</div>
            <small className='out-of-stock'>{!product.inStock && "Out Of Stock"}</small>
            <Link to={`/product/${product._id}`}>
                <img src={`/images/${productImage?.path}`} className='product-image'/>
            </Link>
            <div className='product-price'>
                {product.price}$   
            </div>
        </div>
    )})}
</div>
)}

export default Products