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
  orderProducts: CartProduct[],
  setOrderProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>
}

const OrderModal: React.FC<Props> = ({showModal, setShowModal, orderProducts, setOrderProducts}) => {

  const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
  const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
  const orderProductIds = orderProducts.map(item => item.product._id)
  const notOrderedProducts = products.filter((product: ProductType) => !orderProductIds.some(id => product?._id === id))

  const addNewProductToOrder = (id: string) => {
    const addedProduct = notOrderedProducts.find(product => product._id === id)
    addedProduct && setOrderProducts(prev => [...prev, {product: addedProduct, productQuantity: 1}])
  }

return (
  <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
    <ModalHeader toggle={() => setShowModal(!showModal)}>Add Product</ModalHeader>
    <ModalBody>
      {notOrderedProducts.map(product => {
        const productImage = productImages.find((img: ProductImageType) => img.productId === product?._id)
        return (
        <div className='order-product-modal-item'>
          <img src={productImage?.path} className="admin-productImg"/>
          <div className='order-product-modal-title'>{product.title}</div>
          <AddIcon 
          className='order-product-modal-icon'
          onClick={() => product?._id && addNewProductToOrder(product?._id)}
          />
        </div>
      )})}
    </ModalBody>
  </Modal>
)}

export default OrderModal