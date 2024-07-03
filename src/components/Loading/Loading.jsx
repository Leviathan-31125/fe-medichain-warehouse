import { Modal } from 'react-bootstrap'
import React from 'react'
import { LoadingIcon } from '../../assets'

const Loading = ({visibility}) => {
  return (
    <Modal show={visibility} centered>
        <Modal.Body>
            <div className='d-flex flex-column justify-content-center align-items-center' style={{borderRadius: "20px"}}>
                <p style={{fontWeight: 'bold', fontSize: '25px'}}>Loading</p>
                <img src={LoadingIcon} alt="Medichain-Loading" height={150} className='mb-3'/>
                <p style={{fontSize: '20px'}}>Mohon tunggu sebentar ...</p>
            </div>
        </Modal.Body>
    </Modal>
  )
}

export default Loading