import React,{useEffect} from 'react'
import './Categories.css'
import { axiosInstance } from '../../axiosInstance'
import { ProductType } from '../../Redux/productSlice'
import {Link} from 'react-router-dom'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getAllCategories } from '../../Redux/productSlice'


const Categories : React.FC = () => {

  const allCategories = useTypedSelector(state => state.productSlice.allCategories)
  const onlyOne= (value: any, index: number, self: any) => self.indexOf(value) === index //remove duplicates in array
  const dispatch = useTypedDispatch()

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axiosInstance.get('/api/products')
        Array.isArray(res.data) && res.data?.length > 0 && dispatch(getAllCategories(res.data?.map((product: ProductType) => product.categories).flat().filter(onlyOne)));
      } catch (error: any) {
        console.log(error)
      }
    }
    getCategories()
  }, [allCategories])
  
return (
    <div className='categories-container row-md-2'>
    {allCategories.map((category: string, index: number) => 
        <div key={index} className='item-container'>
            <img 
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEWJz/C4QSRIAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=" 
            className='item-img'
            />
            <div className='item-info'>
                <h1 className='item-title'>{category?.toUpperCase()}</h1>
                <Link to={`/products/${category}`}>
                  <button 
                  className='item-button'
                  >See</button>
                </Link>
            </div>
        </div>
    )}
    </div>
)}

export default Categories