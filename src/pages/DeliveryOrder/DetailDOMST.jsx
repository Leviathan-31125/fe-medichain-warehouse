import React, { useState } from 'react'
import Loading from '../../components/Loading/Loading'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { FilterMatchMode } from 'primereact/api'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { BASE_API_WAREOHUSE, formatDateToDB, getSeverity } from '../../helpers'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'
import { Calendar } from 'primereact/calendar'

const DetailDOMST = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dataDO = location.state
  const dataSO = dataDO.somst
  const customer = dataDO.somst.customer

  const [receivingDialog, setReceivingDialog] = useState(false)
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })
  const [loading, setLoading] = useState(false)
  const [atributReceiving, setAtributReceiving] = useState({
    fd_doarrivaldate: dataDO.fd_doarrivaldate == null? null: new Date(dataDO.fd_doarrivaldate),
    fc_custreceiver: dataDO.fc_custreceiver
  })

  // filter primereact 
  const [ filters, setFilters ] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = {...filters}

    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const renderHeader = (iconData) => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className={iconData}></i>
              </div>
              <div className='d-flex'>
                  <IconField className='d-flex align-items-center' iconPosition="left">
                      <InputIcon className="pi pi-search" />
                      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                  </IconField>
              </div>
          </div>
      </div>
    );
  };

  const statusTemplate = (rowdata) => (
    getSeverity("STATUS_BONUS", rowdata)
  )

  const confirmReceiving = async () => {
    setLoading(true)
    setReceivingDialog(false)
    const fc_dono = window.btoa(dataDO.fc_dono)

    const optionReceiving = {
        method: 'put',
        url: `${BASE_API_WAREOHUSE}/delivery-order/domst/${fc_dono}/receiving`,
        data: {
            fc_custreceiver: atributReceiving.fc_custreceiver,
            fd_doarrivaldate: atributReceiving.fd_doarrivaldate ==null ? null : formatDateToDB(atributReceiving.fd_doarrivaldate)
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
    }

    await axios.request(optionReceiving)
      .then(() => {
        navigate('/master-do')
      })
      .catch((error) => {
        setErrorAttribut({
            visibility: true,
            headerTitle: "Gagal Mengonfirmasi Data",
            errorMessage: error.response.data.message
        })
  
        setLoading(false)
      })
  }

  const footerReceivingDialog = () => (
    <React.Fragment>
        <Button className='buttonAction' label='Cancel' severity='danger' outlined onClick={() => setReceivingDialog(false)}></Button>
        <Button className='buttonAction ms-2' label='Submit' onClick={() => confirmReceiving()}></Button>
    </React.Fragment>
  )

  const receivingChangeHandler = (event) => {
    const {name, value} = event.target;

    setAtributReceiving((currentDate) => ({
        ...currentDate,
        [name]: value
    }))
  }

  return (
    <PageLayout>
      <Loading visibility={loading}/>

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <div className='flex gap-3'>
        <Card className='cardSo'>
          <div className="d-flex gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_sono" className='font-bold block mb-2'>No. SO</label>
              <InputText value={dataDO.fc_sono} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_dono" className='font-bold block mb-2'>No. DO</label>
              <InputText value={dataDO.fc_dono} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_soexpired" className='font-bold block mb-2'>Expired SO</label>
              <InputText value={formatDateToDB(dataSO.fd_soexpired)} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Tanggal DO</label>
              <InputText value={dataDO.fd_dodate_user} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_soexpired" className='font-bold block mb-2'>Gudang</label>
              <InputText value={dataDO.warehouse.fv_warehousename} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Transporter</label>
              <InputText value={dataDO.fv_transporter} className='w-full'/>
            </div>
          </div>
        </Card>
        <Card className='cardCustomer'>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_npwp" className='font-bold block mb-2'>NPWP</label>
              <InputText value={customer.fv_membernpwp} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fv_membername" className='font-bold block mb-2'>Nama Customer</label>
              <InputText value={customer.fv_membername} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_legalstatus" className='font-bold block mb-2'>Legalitas</label>
              <InputText value={customer.fc_legalstatus} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_branchtype" className='font-bold block mb-2'>Status Kantor</label>
              <InputText value={customer.fc_branchtype} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="customer.fc_typebusiness" className='font-bold block mb-2'>Tipe Customer</label>
              <InputText value={customer.fc_typebusiness} className='w-full'/>
            </div>
          </div>
          <div className='flex-auto mb-3'>
              <label htmlFor="dataDO.fv_memberaddress_loading" className='font-bold block mb-2'>Alamat Pengiriman</label>
              <InputText value={dataDO.fv_memberaddress_loading} className='w-full'/>
            </div>
        </Card>
      </div>

      <Card title="Delivery Order" className='mt-3'>
        <DataTable value={dataDO.dodtl} tablestyle={{minwidth:'32rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={() => renderHeader("fas fa-boxes iconHeader")} filters={filters} 
          globalFilterFields={['fc_stockcode', 'invstore.stock.fv_namestock', 'invstore.fc_batch', 'invstore.fd_expired', 'fn_qty', 'fc_namepack', 'fc_statusbonus']}
        >
          <Column field='fn_rownum' header="No" sortable style={{minWidth: '3rem'}}></Column>
          <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='invstore.stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='invstore.fc_batch' header="Batch" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='invstore.fd_expired' header="Expired" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fn_qty' header="Qty" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fc_namepack' header="Satuan" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fc_statusbonus' header="Bonus" body={(data) => statusTemplate(data.fc_statusbonus)} style={{minWidth: '5rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" style={{minWidth: '12rem'}}></Column>
        </DataTable>
      </Card>

      <Dialog visible={receivingDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Submit DO" footer={footerReceivingDialog} onHide={() => ('')}>
        <div className='text-center'>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '10rem', color: 'var(--yellow-300)' }}></i>
            <p style={{fontSize: '22px', fontWeight: '500'}} className='mt-3 mb-0'>Yakin ingin mengonfirmasi penerimaan DO?</p>
        </div>
      </Dialog>

      <Card title="Atribut DO" className='mt-3'>
        <div className='d-flex gap-3'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Penerima</label>
              <InputText disabled={dataDO.fc_status === "SUBMIT" ? false:true } id='fc_custreceiver' name='fc_custreceiver'  value={atributReceiving.fc_custreceiver} onChange={receivingChangeHandler} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Tanggal Penerimaan</label>
              <Calendar disabled={dataDO.fc_status === "SUBMIT" ? false:true } id='fd_doarrivaldate' name='fd_doarrivaldate' value={atributReceiving.fd_doarrivaldate} onChange={receivingChangeHandler} hourFormat='24' showIcon dateFormat='dd MM yy'  className='w-full' />
            </div>
        </div>
      </Card>

      <div className='d-flex justify-content-end gap-2 mt-3'>
        <Button className='buttonAction' label='Kembali' severity='info' onClick={() => navigate(-1)}></Button>
        <Button visible={dataDO.fc_status === "SUBMIT" ? true : false } className='buttonAction' label='Konfirmasi Penerimaan' severity='warning' onClick={() => setReceivingDialog(true)}></Button>
      </div>
    </PageLayout>
  )
}

export default DetailDOMST
