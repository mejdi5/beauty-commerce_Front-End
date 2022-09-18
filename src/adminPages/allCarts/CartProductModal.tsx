import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useTypedSelector } from '../../Redux/Hooks'
import {ProductType} from '../../Redux/productSlice'
import {CartProduct} from '../../Redux/cartSlice'
import AddIcon from '@mui/icons-material/Add';
import {ProductImageType} from '../../Redux/productImageSlice'

interface Props {
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  cartProducts: CartProduct[],
  setCartProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>
}

const CartProductModal: React.FC<Props> = ({showModal, setShowModal, cartProducts, setCartProducts}) => {

  const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
  const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
  const cartProductIds = cartProducts.map(item => item.product._id)
  const notInCartProducts = products.filter((product: ProductType) => !cartProductIds.some(id => product?._id === id))

  const addNewProductToCart = (id: string) => {
    const addedProduct = notInCartProducts.find(product => product._id === id)
    addedProduct && setCartProducts(prev => [...prev, {product: addedProduct, productQuantity: 1}])
  }

return (
  <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
    <ModalHeader toggle={() => setShowModal(!showModal)}>Add Product</ModalHeader>
    <ModalBody>
      {notInCartProducts.map(product => {
        const productImage = productImages.find((img: ProductImageType) => img.productId === product?._id)
        return (
        <div className='order-product-modal-item' key={product?._id}>
          <img src={productImage?.path} className="admin-productImg"/>
          <div className='order-product-modal-title'>{product.title}</div>
          <AddIcon 
          className='order-product-modal-icon'
          onClick={() => product?._id && addNewProductToCart(product?._id)}
          />
        </div>
      )})}
    </ModalBody>
  </Modal>
)}

export default CartProductModal