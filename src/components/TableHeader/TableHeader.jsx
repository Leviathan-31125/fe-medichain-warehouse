import React from 'react'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

const TableHeader = ({globalFilterValue, onGlobalFilterChange, labelButton, actionButton, iconHeader}) => {
  return (
    <div>
        <div className="searchBarLayout">
            <div className="cardHeader">
              <i className={iconHeader}></i>
            </div>
            <div className='d-flex'>
                <IconField className='d-flex align-items-center' iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
                <button className="buttonAdd" onClick={actionButton}>{labelButton}</button>
            </div>
        </div>
    </div>
  )
}

export default TableHeader
