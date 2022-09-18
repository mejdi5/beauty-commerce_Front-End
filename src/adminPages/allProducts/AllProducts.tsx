import React, {useEffect, useState} from 'react'
import "./AllProducts.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from '../../axiosInstance';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { ProductType, getProducts } from '../../Redux/productSlice';
import { ProductImageType, getAllProductImages } from '../../Redux/productImageSlice';
import AddIcon from '@mui/icons-material/Add';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';


const AllProducts: React.FC = () => {

    const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
    const dispatch = useTypedDispatch()
    const [msg, setMsg] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        try {
            const res = await axiosInstance.delete(`/api/products/${id}`)
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error.message)
        }
    };

    const columns = [
        { field: "id", 
            headerName: "PRODUCT ID", 
            width: 220 },
        {
            field: "title",
            headerName: "PRODUCT NAME",
            width: 550,
            renderCell: (params: any) => {
            return (
                <div>
                    <img className="admin-productImg" src={params.row.image} alt="" />
                    {params.row.title}
                </div>
            );
            },
        },
        {
        field: "categories",
        headerName: "PRODUCT CATEGORIES",
        width: 180,
        },
        {
        field: "price",
        headerName: "PRICE",
        width: 70,
        },
        {
        field: "inStock",
        headerName: "IN STOCK",
        width: 150,
        renderCell: (params: any) => {
            return (
                <div className='product-in-stock'>
                    <div>
                        {params.row.inStock ? "In Stock" : "Out Of Stock"}
                    </div>
                    <div className={params.row.inStock ? "in-stock-icon" : "out-of-stock-icon"}>
                        <Brightness1RoundedIcon/>
                    </div>
                </div>
            );
        },
        },
        {
        field: "action",
        headerName: "ACTION",
        width: 100,
        renderCell: (params: any) => {
            return (
                <div className='product-action'>
                    <Link to={`/edit-product/${params.row.id}`}>
                        <EditIcon className="product-edit" color="primary"/>
                    </Link>
                    <DeleteIcon
                    className="product-delete"
                    color="action"
                    onClick={() => handleDelete(params.row.id)}
                    />
                </div>
            );
        },
        },
    ];
    

    const productRows = products.map((product: ProductType) => {
        const productImage = productImages.find((img: ProductImageType) => img?.productId === product?._id)
        return {
        id: product._id,
        title: product.title,
        image: `/images/${productImage?.path}`,
        categories: product.categories?.join(' / ').toUpperCase(),
        price: `${product.price}$`,
        inStock: product.inStock,
    }})


    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axiosInstance.get("/api/products");
                dispatch(getProducts(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        const getProductImages = async () => {
            try {
            const res = await axiosInstance.get("/api/product-images"); 
            dispatch(getAllProductImages(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        getAllProducts();
        getProductImages();
    }, [products]);
    
return (
<div className="allProducts">
    <Sidebar/>
    <div className="allProducts-container">
        <Link to="/newProduct">
            <div>
                <AddIcon className="product-new"/>
            </div>
        </Link>                    
    {msg && <div className='product-delete-msg'>{msg}</div>}
    {productRows.length > 0
        ?
        <DataGrid
        rows={productRows}
        columns={columns}
        />
        :
        <div className='no-products'>No Products</div>
    }
    </div>
</div>
)}

export default AllProducts 
