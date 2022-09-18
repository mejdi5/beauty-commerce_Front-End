import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useTypedSelector } from '../../Redux/Hooks'
import {UserType} from '../../Redux/userSlice'
import AddIcon from '@mui/icons-material/Add';
import {ImageType} from '../../Redux/imageSlice'

interface Props {
    showUserModal: boolean,
    setShowUserModal: React.Dispatch<React.SetStateAction<boolean>>,
    userId: string | null,
    setUserId: React.Dispatch<React.SetStateAction<string | null>>
}

const CartUserModal: React.FC<Props> = ({showUserModal, setShowUserModal, userId, setUserId}) => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const images = useTypedSelector<ImageType[] | never[]>(state => state.imageSlice.images)

return (
<Modal isOpen={showUserModal} toggle={() => setShowUserModal(!showUserModal)}>
    <ModalHeader toggle={() => setShowUserModal(!showUserModal)}>User</ModalHeader>
    <ModalBody>
    {users.filter((user: UserType) => !user?.isAdmin).map(user => {
        const userImage = images.find((img: ImageType) => img.userId === user?._id)
        return (
        <div className='order-product-modal-item' key={user?._id}>
            <img src={userImage?.path} className="admin-productImg"/>
            <div className='order-product-modal-title'>{user?.firstName} {user?.lastName}</div>
            <AddIcon 
            className='order-product-modal-icon'
            onClick={() => user?._id && setUserId(user?._id)}
            />
        </div>
    )})}
    </ModalBody>
</Modal>
)}

export default CartUserModal