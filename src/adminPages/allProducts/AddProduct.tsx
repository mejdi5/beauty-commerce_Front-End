import React,{FormEvent, useState} from 'react'
import "./AllProducts.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate } from 'react-router-dom'
import { getProductImage } from '../../Redux/productImageSlice'
import { axiosInstance } from '../../axiosInstance'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';


const AddProduct: React.FC = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [picture, setPicture] = useState<any>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [categories, setCategories] = useState<string[] | never[]>([])
    const [price, setPrice] = useState(0)
    const [inStock, setInStock] = useState(true)
    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate() 

    const uploadProductImage = async (e: FormEvent, id: string) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const res = await axiosInstance.post(`/api/product-images/upload/${id}`, formData)
            dispatch(getProductImage(res.data.path))
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddProduct = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newProduct = {title, description, categories, price, inStock}
            const res = await axiosInstance.post(`/api/products`, newProduct)
            uploadProductImage(e, res.data.savedProduct._id);
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error)
        }
        setTitle('')
        setDescription('')
        setCategories([])
        setCategory('')
        setPrice(0)
        setInStock(true)
        setTimeout(() => navigate(-1), 1500)
    }


return (
<div className="add-edit-product">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-product-container">
        {msg && <div className='add-product-msg'>{msg}</div>}
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
        onClick={e => handleAddProduct(e)}
        >Submit</button>
    </div>
</div>
)}

export default AddProduct