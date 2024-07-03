import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'

const ErrorDialog = ({visibility, setAttribute, headerTitle, errorMessage}) => { 
    const errorDialogFooter = () => (
        <div className='flex-auto text-center'>
            <Button label="Oke" className='mr-3' severity='warning' onClick={() => setAttribute((currentData) => ({...currentData, visibility: false}))}/>
        </div>
    )
  
    return (
    <Dialog visible={visibility} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={headerTitle} footer={errorDialogFooter} onHide={() => setAttribute((currentData) => ({...currentData, visibility: false})) }>
        <div className='text-center'>
            <i className="pi pi-exclamation-circle" style={{ fontSize: '6rem', color: 'var(--yellow-400)' }}></i>
            <p style={{fontSize: '22', fontWeight: '500'}} className='mt-3 mb-0'>{errorMessage}</p>
        </div>
    </Dialog>
  )
}

export default ErrorDialog
