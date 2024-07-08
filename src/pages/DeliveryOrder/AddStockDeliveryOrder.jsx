import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'

const AddStockDeliveryOrder = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [detailDialog, setDetailDialog] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [detailSO, setDetailSO] = useState(null)
  const [listDetailInventory, setListDetailInventory] = useState([])
  const [dataDO, setDataDO] = useState({})
  const [submitTogle, setSubmitTogle] = useState(false)
  const [atributDO, setAttributDO] = useState({
    fn_dodetail: 0,
    fv_transporter: "",
    fv_memberaddress_loading: "",
    fd_dodate_user: null
  })
  const [dataSO, setDataSO] = useState({
    fc_sono: "",
    fd_sodate_user: "",
    fd_soexpired: "",
    fc_sotype: ""
  })
  const [customer, setCustomer] = useState({
    fv_membernpwp: "",
    fv_membername: "",
    fc_legalstatus: "",
    fc_branchtype: "",
    fc_typebusiness: ""
  })
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })

  // filter primereact 
  const [ filters, setFilters ] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const [ invstoreFilters, setInvstoreFilters ] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS}
  }) 
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [inventoryFilterValue, setInventoryFilterValue] = useState('');
  
  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = {...filters}

    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const onInventoryFilterChange = (e) => {
    const value = e.target.value
    let _filters = {...invstoreFilters}

    _filters['global'].value = value
    setInvstoreFilters(_filters)
    setInventoryFilterValue(value)
  }

  const getDataTempDOMST = async () => {
    setLoading(true)

    const fc_dono = window.btoa(localStorage.getItem('userId'));

    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-mst/so/${fc_dono}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        const dataDO = response.data.data;
        dataDO.fd_dodate_user = new Date(dataDO.fd_dodate_user)

        setDataDO(dataDO)
        setDataSO(dataDO.somst)
        setCustomer(dataDO.somst.customer)
        setAttributDO({
          fn_dodetail: dataDO.fn_dodetail,
          fv_transporter: dataDO.fv_transporter,
          fv_memberaddress_loading: dataDO.somst.customer.fv_memberaddress_loading,
          fd_dodate_user: dataDO.fd_dodate_user
        })

        if (dataDO.fv_transporter !== "" && dataDO.fv_memberaddress_loading !== "") {
          setSubmitTogle(true)
        }
        setLoading(false)
      })
      .catch(() => {
        navigate('/delivery-order')
      })
  }

  const getDetailInvstore = async (data) => {
    setLoading(true)
    setDetailSO(data)
    const fc_barcode = window.btoa(data.fc_barcode);
    
    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/invstore/stock/${fc_barcode}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        setListDetailInventory(response.data)
        setLoading(false)
        setDetailDialog(true)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Add Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const addStockDO = async (data) => {
    setLoading(true)
    setDetailDialog(false)

    const fc_dono = window.btoa(localStorage.getItem('userId'))
    const dataAdd = {
      fc_barcode: data.fc_barcode,
      fc_statusbonus: detailSO.fc_statusbonus,
      fn_qty: data.qty_add
    }

    const optionAddData = {
      method: 'post',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-dtl/${fc_dono}`,
      data: dataAdd,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionAddData)
      .then(() => {
        setRefresh(!refresh)
        setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Add Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const removeStockDo = async (data) => {
    setLoading(true)

    const fc_dono = window.btoa(localStorage.getItem('userId'))

    const optionAddData = {
      method: 'delete',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-dtl/${fc_dono}`,
      data: {
        fn_rownum: data.fn_rownum,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionAddData)
      .then(() => {
        setRefresh(!refresh)
        setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Add Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const submitDeliveryOrder = async () => {
    setLoading(true)
    setSubmitDialog(false)
    const fc_dono = window.btoa(localStorage.getItem('userId'))

    const optionSubmit = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-mst/${fc_dono}/submit`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionSubmit)
      .then(() => {
        setRefresh(!refresh)
        setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Add Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const cancelDeliveryOrder = async () => {
    setLoading(true)
    setCancelDialog(false)
    const fc_dono = window.btoa(localStorage.getItem('userId'))

    const optionSubmit = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-mst/${fc_dono}/cancel`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionSubmit)
      .then(() => {
        setRefresh(!refresh)
        setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Add Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const updatedAttribute = async () => {
    setLoading(true)

    const fc_dono = window.btoa(localStorage.getItem('userId'))

    const optionUpdateData = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-mst/${fc_dono}`,
      data: {
        fv_transporter: atributDO.fv_transporter,
        fv_memberaddress_loading: atributDO.fv_memberaddress_loading,
        fd_dodate_user: formatDateToDB(atributDO.fd_dodate_user)
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdateData)
      .then(() => {
        setRefresh(!refresh)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Update Data",
          errorMessage: error.response.data.message
        })
        setLoading(false)
      })
  }

  const changeAtributHandler = (event) => {
    const {name, value} = event.target

    setAttributDO((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  useEffect(() => {
    getDataTempDOMST()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

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

  const renderHeaderDetail = () => {
    return (
      <div className='d-flex justify-content-end'>
        <IconField className='d-flex align-items-center' iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText value={inventoryFilterValue} onChange={onInventoryFilterChange} placeholder="Keyword Search" />
        </IconField>
      </div>
    );
  }

  const statusTemplate = (rowdata) => (
    getSeverity("STATUS_BONUS", rowdata)
  )

  const actionBodyTemplate = (data) => {
    if(data.fn_qty === data.fn_qty_do) 
      return <Button disabled icon="pi pi-check" severity='success' className='buttonAction'></Button>
    else
      return <Button label='Pilih' severity='warning' className='buttonAction' onClick={() => getDetailInvstore(data)}></Button>
  }

  const selectBodyTemplate = (data) => {
    return (
      <Button label='Select' severity='success' className='buttonAction' style={{padding: '3px'}} onClick={() => addStockDO(data)}></Button>
    )
  }

  const deleteBodyTemplate = (data) => {
    return (
      <Button icon="pi pi-trash" outlined severity='danger' className='buttonAction' onClick={() => removeStockDo(data)}></Button>
    )
  }

  const inputQtyTemplate = (data) => {
    let maxValue = (detailSO.fn_qty - detailSO.fn_qty_do) > data.fn_quantity ? data.fn_quantity : (detailSO.fn_qty - detailSO.fn_qty_do)
    data["qty_add"] = maxValue

    return (
      <InputNumber value={maxValue} onValueChange={(e) => data["qty_add"] = e.target.value} min={1} max={maxValue} className='p-inputtext-sm'/>
    )
  }

  const footerSubmitDialog = () => (
    <React.Fragment>
        <Button className='buttonAction' label='Cancel' severity='danger' outlined onClick={() => setSubmitDialog(false)}></Button>
        <Button className='buttonAction ms-2' label='Submit' onClick={() => submitDeliveryOrder()}></Button>
    </React.Fragment>
  )

  const footerCancelDialog = () => (
    <React.Fragment>
        <Button className='buttonAction' label='Cancel' outlined onClick={() => setCancelDialog(false)}></Button>
        <Button className='buttonAction ms-2' label='Sure' severity='danger' onClick={() => cancelDeliveryOrder()}></Button>
    </React.Fragment>
  )

  return (
    <PageLayout>
      <Loading visibility={loading}/>

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Dialog header="Rincian Persediaan" visible={detailDialog} style={{ width: '70rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
       onHide={() => setDetailDialog(false)}>
        <DataTable value={listDetailInventory} tablestyle={{minwidth:'70rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={renderHeaderDetail} filters={invstoreFilters} 
          globalFilterFields={['fc_stockcode', 'stock.fv_namestock', 'stock.fv_namealias_stock', 'stock.fv_group', 'stock.fc_formstock', 'fn_quantity', 'stock.fc_namepack', 'fd_expired', 'fc_batch', 'ft_description']}>
            <Column field='fc_stockcode' header="Katalog" style={{minWidth: '8rem'}}></Column>
            <Column field='stock.fv_namestock' header="Nama Stok" style={{minWidth: '10rem'}}></Column>
            <Column field='stock.fv_group' header="Grup" style={{minWidth: '8rem'}}></Column>
            <Column field='fd_expired' header="Expired" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fc_batch' header="Kode Batch" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fn_quantity' header="Qty" body={inputQtyTemplate} sortable style={{minWidth: '5rem'}}></Column>
            <Column field='stock.fc_namepack' header="Satuan" style={{minWidth: '8rem'}}></Column>
            <Column body={selectBodyTemplate} style={{minWidth: '8rem'}}></Column>
        </DataTable>
      </Dialog>

      <div className='flex gap-3'>
        <Card className='cardSo'>
          <div className="d-flex gap-2">
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_sono" className='font-bold block mb-2'>No. SO</label>
              <InputText value={dataSO.fc_sono} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fc_sono" className='font-bold block mb-2'>Tipe SO</label>
              <InputText value={dataSO.fc_sotype} className='w-full'/>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_sodate_user" className='font-bold block mb-2'>Tanggal SO</label>
              <InputText value={dataSO.fd_sodate_user} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_soexpired" className='font-bold block mb-2'>Expired SO</label>
              <InputText value={dataSO.fd_soexpired} className='w-full'/>
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
        </Card>
      </div>

      <Card title="List Order" className='mt-3'>
        <DataTable value={dataSO.sodtl} tablestyle={{minwidth:'32rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={() => renderHeader("fas fa-boxes iconHeader")} filters={filters} 
          globalFilterFields={['fc_stockcode', 'stock.fv_namestock', 'fc_namepack', 'ft_description']}
        >
          <Column field='fn_rownum' header="No" sortable style={{minWidth: '3rem'}}></Column>
          <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fc_namepack' header="Satuan" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fn_qty' header="Pesanan" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fn_qty_do' header="Terkirim" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fc_statusbonus' header="Bonus" body={(data) => statusTemplate(data.fc_statusbonus)} style={{minWidth: '5rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" style={{minWidth: '12rem'}}></Column>
          <Column body={actionBodyTemplate}/>
        </DataTable>
      </Card>

      <Card title="Delivery Order" className='mt-3'>
        <DataTable value={dataDO.tempdodtl} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={() => renderHeader("fas fa-truck iconHeader")} filters={filters} 
          globalFilterFields={['fc_stockcode', 'stock.fv_namestock', 'fc_namepack', 'ft_description']}
        >
          <Column field='fn_rownum' header="No" sortable style={{minWidth: '3rem'}}></Column>
          <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='invstore.stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='invstore.fc_batch' header="Batch" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='invstore.fd_expired' header="Expired" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fn_qty' header="Qty" sortable style={{minWidth: '5rem'}}></Column>
          <Column field='fc_namepack' header="Satuan" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fc_statusbonus' header="Bonus" body={(data) => statusTemplate(data.fc_statusbonus)} style={{minWidth: '8rem'}}></Column>
          <Column body={deleteBodyTemplate}></Column>
        </DataTable>
      </Card>

      <Dialog visible={submitDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Submit DO" footer={footerSubmitDialog} onHide={() => setSubmitDialog(false)}>
        <div className='text-center'>
            <i className="pi pi-check" style={{ fontSize: '10rem', color: 'var(--green-300)' }}></i>
            <p style={{fontSize: '22px', fontWeight: '500'}} className='mt-3 mb-0'>Yakin ingin submit delivery order?</p>
        </div>
      </Dialog>

      <Dialog visible={cancelDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Cancel DO" footer={footerCancelDialog} onHide={() => setCancelDialog(false)}>
        <div className='text-center'>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '10rem', color: 'var(--yellow-300)' }}></i>
            <p style={{fontSize: '22px', fontWeight: '500'}} className='mt-3 mb-0'>Yakin ingin submit delivery order?</p>
        </div>
      </Dialog>

      <Card title="Atribut DO" className='mt-3'>
        <div className='d-flex gap-3'>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Jumlah Item</label>
              <InputText value={atributDO.fn_dodetail} className='w-full'/>
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fd_dodate_user" className='font-bold block mb-2'>Tanggal Delivery Order</label>
              <Calendar id='fd_dodate_user' name='fd_dodate_user' value={atributDO.fd_dodate_user} hourFormat='24' showIcon onChange={changeAtributHandler} dateFormat='dd MM yy'  className='w-full' />
            </div>
            <div className='flex-auto mb-3'>
              <label htmlFor="fv_transporter" className='font-bold block mb-2'>Transportasi</label>
              <InputText id='fv_transporter' name='fv_transporter' value={atributDO.fv_transporter}  onChange={changeAtributHandler} className='w-full'/>
            </div>
            <div className='flex-auto mb-3 w-50'>
              <label htmlFor="fv_memberaddress_loading" className='font-bold block mb-2'>Alamat Pengiriman</label>
              <InputText id='fv_memberaddress_loading' name='fv_memberaddress_loading' value={atributDO.fv_memberaddress_loading} onChange={changeAtributHandler} className='w-full'/>
            </div>
        </div>
        <div className='flex justify-content-end'>
          <Button className="buttonAction" label='Update Atribut' severity='primary' style={{padding: '5px'}} onClick={() => updatedAttribute()}></Button>
        </div>
      </Card>

      <div className='d-flex justify-content-end gap-2 mt-3'>
        <Button className='buttonAction' label='Cancel' severity='danger' onClick={() => setCancelDialog(true)}></Button>
        <Button visible={submitTogle} className='buttonAction' label='Submit' severity='warning' onClick={() => setSubmitDialog(true)}></Button>
      </div>
    </PageLayout>
  )
}

export default AddStockDeliveryOrder
