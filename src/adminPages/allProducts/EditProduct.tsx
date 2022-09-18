import React,{FormEvent, useState, useEffect, KeyboardEvent} from 'react'
import "./AllProducts.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductType } from '../../Redux/productSlice';
import { axiosInstance } from '../../axiosInstance'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ProductImageType, getProductImage } from '../../Redux/productImageSlice'


const EditProduct = () => {

    const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
    const productId = useParams().productId
    const productToEdit = products && products.find((product: ProductType) => product?._id === productId)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
    const [picture, setPicture] = useState<any>(null)
    const [title, setTitle] = useState(productToEdit?.title || '')
    const [description, setDescription] = useState(productToEdit?.description || '')
    const [category, setCategory] = useState<string | null>(null)
    const [categories, setCategories] = useState<string[] | never[]>(productToEdit?.categories || [])
    const [price, setPrice] = useState(productToEdit?.price || 0)
    const [inStock, setInStock] = useState<boolean>(productToEdit?.inStock || true)
    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate() 


    //post new product image
    const uploadProductImage = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const res = await axiosInstance.post(`/api/product-images/upload/${productId}`, formData)
            res.data.savedImage && dispatch(getProductImage(res.data.savedImage.path))
        } catch (error) {
            console.log(error)
        }
    }


    const handleEditProduct = async (e: FormEvent) => {
        e.preventDefault();
        picture && uploadProductImage(e);
        try {
            const editedProduct = {title, description, categories, price, inStock}
            const res = await axiosInstance.put(`/api/products/${productId}`, editedProduct)
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error)
        }
        setTitle('')
        setDescription('')
        setCategories([])
        setPrice(0)
        setInStock(true)
        setTimeout(() => navigate(-1), 1500)
    }
    


return (
<div className="add-edit-product">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="edit-product-container">
        {msg && <div className='edit-product-msg'>{msg}</div>}
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Title</label>
            <input 
            type="text" 
            className="form-control add-edit-product-input" 
            placeholder="Enter Product Title.." 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Description</label>
            <textarea 
            className="form-control add-edit-product-input" 
            placeholder="Enter Product Description.." 
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Categories</label>
            <div className="add-edit-product-category">
                <input
                type="text"
                className="form-control add-edit-product-category-input"
                placeholder="New Category.." 
                value={category || ''}
                onChange={e => setCategory(e.target.value)}
                />
                <AddIcon
                color="action"
                className='add-edit-product-category-icon'
                onClick={() => {
                    category && setCategories(prev => [...prev, category]);
                    setCategory(null)
                    }
                }
                />
            </div>
            <div className='add-edit-category-display'>
            {categories.map((categ, index) => 
                <div className='category-display' key={index}>
                    <span className="category-text-display">{categ}</span>
                    <CloseIcon 
                    className='delete-product-category-icon'
                    onClick={() => setCategories(prev => prev.filter(cat => cat !== categ))}
                    />
                </div>
            )}
            </div>
        </div>
        <div className="form-group add-edit-product-form-group-price">
            <label className="form-group add-edit-product-label">Price</label>
            <input 
            type="number" 
            className="form-control add-edit-product-input-price" 
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Image</label>
            <input 
            type="file" 
            className="form-control add-edit-product-input" 
            onChange={e => e.target.files && setPicture(e.target.files[0])}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">In Stock ?</label>
            <input 
            type="checkbox" 
            checked={inStock}
            onChange={() => setInStock(!inStock)}
            />
        </div>
        
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleEditProduct(e)}
        >Submit</button>
    </div>
</div>
)}

export default EditProduct