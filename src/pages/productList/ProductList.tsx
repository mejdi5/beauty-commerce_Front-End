import React from 'react'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import Products from '../../components/products/Products'
import './ProductList.css'
import { useNavigate, useParams} from 'react-router-dom'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { UserType } from '../../Redux/userSlice'
import ActivateAccount from '../../components/activateAccount/ActivateAccount'
import Sidebar from '../../adminComponents/sidebar/Sidebar'


interface Props {
    filterProductsWord: string,
    setFilterProductsWord: React.Dispatch<React.SetStateAction<string>>,
    sort: string,
    setSort: React.Dispatch<React.SetStateAction<string>>
}


const ProductList : React.FC<Props> = ({filterProductsWord, setFilterProductsWord, sort, setSort}) => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const category = useParams().category
    const dispatch = useTypedDispatch()
    const navigate = useNavigate()


return (
<div className={(user && user.isAdmin) ? 'App admin-productList' : 'App'}>
{user && user.isAdmin && <Sidebar/>}
<div className={(user && user.isAdmin) ? 'admin-productList-container' : 'productList-container'}>
    {(!user || !user.isAdmin ) && <Navbar/>} 
    {(user && !user.verified) && <ActivateAccount/>}
    {(!user || !user.isAdmin ) && <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>} 
    <h1 className='products-title'>{typeof category === 'string' && category?.toUpperCase()}</h1>
    <div className='products-filter'>
        <div className='filter'>
            <span className='filterText'>Filter</span>
            <input 
            className="form-control filter-input"
            placeholder="Search.."
            value={filterProductsWord}
            onChange={e => setFilterProductsWord(e.target.value)}
            />
        </div>
        <div className='filter'>
            <span className='filterText'>Sort</span>
            <select className='select' onChange={e => setSort(e.target.value)}>
                <option disabled value="sort by">Sort By</option>
                <option value="recent">Recent</option>
                <option value="price">Price</option>
                <option value="alphabetical order">Alphabetical</option>
            </select>
        </div>
    </div>
    <Products filterProductsWord={filterProductsWord} sort={sort} />
    {(!user || !user.isAdmin ) && <Footer/>} 
</div>
</div>
)}

export default ProductList