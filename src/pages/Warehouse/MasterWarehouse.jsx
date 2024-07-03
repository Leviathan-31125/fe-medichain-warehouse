import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { Dialog } from 'primereact/dialog'
import Loading from '../../components/Loading/Loading'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BASE_API_WAREOHUSE, OnChangeValue } from '../../helpers'
import axios from 'axios'
import { FilterMatchMode } from 'primereact/api'
import TableHeader from '../../components/TableHeader/TableHeader'
import { Button } from 'primereact/button'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'

const MasterWarehouse = () => {
  const [loading, setLoading] = useState(false);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [dialogAddUpdate, setDialogAddUpdate] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false)
  const [refresh, setRefresh] = useState(false);
  const [statusAction, setStatusAction] = useState('CREATE');
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })
  const [detailWarehouse, setDetailWarehouse] = useState({
    fc_warehousecode: null,
    fv_warehousename: "",
    fc_position: "",
    fv_warehouseaddress: "",
    ft_description: "",
  });
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

  const getAllWarehouse = async () => {
    setLoading(true)
    const optionGetWarehouse = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/warehouse`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetWarehouse)
      .then((response) => {
        setListWarehouse(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Load Data",
          errorMessage: error.response.data.message
        })
        
        setLoading(false)
      })
  }

  const createWarehouse = async () => {
    const optionCreateWareohuse = {
      method: 'post',
      url: `${BASE_API_WAREOHUSE}/warehouse`,
      data: detailWarehouse,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionCreateWareohuse)
      .then((response) => {
        if(response.data.status === 201) {
          setRefresh(!refresh)
          setLoading(false)
          resetData()
        }
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Create",
          errorMessage: error.response.data.message
        })

        resetData()

        setLoading(false)
      })
  }

  const updateWarehouse = async () => {
    const warehouseCode = window.btoa(detailWarehouse.fc_warehousecode)

    const optionUpdateWareohuse = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/warehouse/${warehouseCode}`,
      data: detailWarehouse,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdateWareohuse)
      .then((response) => {
        if(response.data.status === 201) {
          setRefresh(!refresh)
          setLoading(false)
          resetData()
        }
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Update",
          errorMessage: error.response.data.message
        })

        resetData()
        setLoading(false)
      })
  }

  const deleteWarehouse = async () => {
    const warehouseCode = window.btoa(detailWarehouse.fc_warehousecode)
    
    const optionDeleteWareohuse = {
      method: 'delete',
      url: `${BASE_API_WAREOHUSE}/warehouse/${warehouseCode}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionDeleteWareohuse)
      .then((response) => {
        if(response.data.status === 200) {
          setRefresh(!refresh)
          setLoading(false)
          resetData()
        }
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Delete",
          errorMessage: error.response.data.message
        })

        resetData()
        setLoading(false)
      })
  }

  const resetData = () => { 
    setDetailWarehouse({
      fc_warehousecode: null,
      fv_warehousename: "",
      fc_position: "",
      fv_warehouseaddress: "",
      ft_description: ""
    })
  }

  useEffect(() => {
    getAllWarehouse()
  }, [refresh])

  const saveHandler = () => {
    setDialogAddUpdate(false)

    if (statusAction === "CREATE") createWarehouse()
    if (statusAction === "UPDATE") updateWarehouse()
  }

  const renderHeader = () => {
    return (
        <TableHeader onGlobalFilterChange={onGlobalFilterChange} labelButton={"Tambah Gudang"} 
         globalFilterValue={globalFilterValue} actionButton={() => showDialog("CREATE")} iconHeader={"fas fa-warehouse iconHeader"}/>
    );
  };

  const footerDialogAddUpdate = () => {
    return (
      <React.Fragment>
          <Button label="Cancel" icon="pi pi-times" outlined onClick={() => hideDialog("CREATE")} className='mr-3'/>
          <Button label="Save" icon="pi pi-check" onClick={() => saveHandler()}/>
      </React.Fragment>
    )
  }

  const actionBodyTemplate = (data) => (
    <div className="d-flex gap-2">
      <Button className='buttonAction' icon="pi pi-pencil" severity='primary' onClick={() => showDialog("UPDATE", data)}/>
      <Button className='buttonAction' outlined icon="pi pi-trash" severity='danger' onClick={() => showDialog("DELETE", data)}/>
    </div>
  )

  const templateDescription = (data) => {
    return data === null ? " - ": data;
  }

  const hideDialog = (type) => {
    if (type === "CONFIRM") setDialogConfirm(false)
    if (type === "CREATE" || type === "UPDATE") setDialogAddUpdate(false)
    resetData()
  }

  const showDialog = (type, data) => {
    if (data) {
      setDetailWarehouse((currentData) => ({
        ...currentData,
        ...data
      }))
    }

    if (type === "CREATE" || type === "UPDATE") {
      if (type === "CREATE") setStatusAction("CREATE")
      else setStatusAction("UPDATE")
      setDialogAddUpdate(true)
    }

    if (type === "DELETE") {
      setDetailWarehouse((currentData) => ({
        ...currentData,
        fc_barcode: data.fc_barcode
      }))

      setDialogConfirm(true)
    }
  }

  return (
    <PageLayout>
      <Loading visibility={loading}/>

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <ConfirmDialog visibility={dialogConfirm} submitAction={() => deleteWarehouse()} cancelAction={() => hideDialog("CONFIRM")} confirmMessage={"Yakin ingin menghapus Gudang ini?"} 
       iconConfirm="pi pi-exclamation-triangle" headerTitle="Hapus Gudang" />
      
      <Dialog header="Gudang" visible={dialogAddUpdate} style={{ width: '32rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
       onHide={() => hideDialog("UPDATE")} footer={footerDialogAddUpdate}>
        <div className='flex-auto mb-3'>
          <label htmlFor="fv_warehousename" className='font-bold block mb-2'>Nama Gudang</label>
          <InputText id='fv_warehousename' name='fv_warehousename' value={detailWarehouse.fv_warehousename} onChange={(e) => OnChangeValue(e, setDetailWarehouse)} 
          className='w-full' required autoFocus/>
        </div>
        
        <div className='flex-auto mb-3'>
          <label htmlFor="fc_position" className='font-bold block mb-2'>Status Posisi</label>
          <Dropdown id='fc_position' name='fc_position' options={["INTERNAL", "EKSTERNAL"]} value={detailWarehouse.fc_position} onChange={(e) => OnChangeValue(e, setDetailWarehouse)} 
           className='w-full' placeholder='Pilih status' required autoFocus/>
        </div>

        <div className='flex-auto mb-3'>
          <label htmlFor="fv_warehouseaddress" className='font-bold block mb-2'>Alamat</label>
          <InputText id='fv_warehouseaddress' name='fv_warehouseaddress' value={detailWarehouse.fv_warehouseaddress} onChange={(e) => OnChangeValue(e, setDetailWarehouse)} 
          className='w-full' required autoFocus/>
        </div>

        <div className='flex-auto mb-3'>
          <label htmlFor="ft_description" className='font-bold block mb-2'>Deskripsi</label>
          <InputTextarea id='ft_description' name='ft_description' value={detailWarehouse.ft_description} onChange={(e) => OnChangeValue(e, setDetailWarehouse)} rows={3} className='w-full' required autoFocus/>
        </div>
      </Dialog>

      <Card title="Daftar Gudang">
        <DataTable value={listWarehouse} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_warehousecode' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['fv_warehousename', 'fc_position', 'fv_warehouseaddress', 'ft_description']}
        >
          <Column field='fv_warehousename' header="Nama Gudang" sortable style={{minWidth: '12rem'}}></Column>
          <Column field='fc_position' header="Status Gudang" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fv_warehouseaddress' header="Alamat" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '10rem'}}></Column>
          <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default MasterWarehouse
