import React,{useState, useEffect} from 'react'
import './Slider.css'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ProductType } from '../../Redux/productSlice'
import { useTypedSelector } from '../../Redux/Hooks'
import {ProductImageType} from '../../Redux/productImageSlice'


const Slider : React.FC = () => {

    const [slideIndex, setSlideIndex] = useState(1)
    const [slideProducts, setSlideProducts] = useState<ProductType[] | never[]>([])
    const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)


    //move to next slide
    const nextSlide = () => {
        if(slideIndex !== slideProducts.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === slideProducts.length){
            setSlideIndex(1)
        }
    }

    //move to previous slide
    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(slideProducts.length)
        }
    }

    //move slides by dots
    const moveDot = (index : number) => {
        setSlideIndex(index)
    }

    useEffect(() => {
        setSlideProducts(products.slice(0, 5))
    }, [products])
    

    //automatic slide move
    useEffect(() => {
    setTimeout(() => {
        nextSlide()
    }, 10000)
    }, [slideIndex])
    

return (
<div className='slider-container'>
    <div 
    className='slider-arrow left-arrow'
    onClick={prevSlide}
    >
        <NavigateBeforeIcon />
    </div>
    <div className='slide-wrapper'>
    {slideProducts && Array.isArray(slideProducts) && slideProducts?.map((slideProduct: ProductType, index) => {
            const productImage = productImages.find((img: ProductImageType) => img?.productId === slideProduct?._id)
                return (
                    <div 
                    className={slideIndex === index + 1 ? "slide active" : "slide"}
                    key={index}
                    >
                        <img className='slide-image' src={`/images/${productImage?.path}`} />
                        <div className='slide-info'>
                            <h1 className='slide-title'>{slideProduct.title}</h1>
                            <p className='slide-description'>{slideProduct.description}</p>
                        </div>
                    </div>
                )
    })}
        <div className="slide-dots">
                {Array.from({length: slideProducts.length}).map((item, index) => (
                    <div 
                    key={index}
                    onClick={() => moveDot(index + 1)}
                    className={slideIndex === index + 1 ? "dot active" : "dot"}
                    ></div>
                ))}
        </div>
    </div>
    <div 
    className='slider-arrow right-arrow'
    onClick={nextSlide}
    >
        <NavigateNextIcon/>
    </div>
</div>
)
}

export default Slider