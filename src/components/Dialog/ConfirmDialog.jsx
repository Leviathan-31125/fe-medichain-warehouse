import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'

const ConfirmDialog = ({visibility, cancelAction, submitAction, confirmMessage, iconConfirm, headerTitle}) => {
    const verifDialogFooter = () => (
        <React.Fragment>
            <div className='flex-auto text-center'>
                <Button label="Batal" icon="pi pi-times" outlined className='mr-3' onClick={cancelAction}/>
                <Button label="Yakin" icon="pi pi-check" severity="danger" onClick={submitAction}/>
            </div>
        </React.Fragment>
    )
  
    return (
    <Dialog visible={visibility} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={headerTitle} footer={verifDialogFooter} onHide={cancelAction}>
        <div className="confirmation-content text-center">
            <i className={iconConfirm || "pi pi-check-circle"}  style={{ fontSize: '6rem', color: 'var(--yellow-500)' }}/>
            <h5 className='mt-4'>{confirmMessage}</h5>
        </div>
    </Dialog>
  )
}

export default ConfirmDialog
