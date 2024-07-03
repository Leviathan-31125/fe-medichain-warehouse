import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import './MasterBrand.css';
import '../../index.css';
import Loading from '../../components/Loading/Loading';
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { BASE_API_WAREOHUSE } from '../../helpers';
import axios from 'axios';
import { FilterMatchMode } from 'primereact/api';
import TableHeader from '../../components/TableHeader/TableHeader';
import { OnChangeValue } from '../../helpers';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { groupBrand } from '../../helpers';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Image } from 'primereact/image';
import ErrorDialog from '../../components/Dialog/ErrorDialog';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';

const MasterBrand = () => {
  const [listBrand, setListBrand] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogConfirm, setDialogConfirm] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [dialogAddUpdate, setDialogAddUpdate] = useState(false)
  const [statusAction, setStatusAction] = useState("CREATE")
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })
  const [detailBrand, setDetailBrand] = useState({
    fc_brandcode: "",
    fv_brandname: "",
    fv_group: null,
    ft_image: "",
    ft_description: ""
  });

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

  const getAllBrand = async () => {
    setLoading(true)
    const optionGetBrands = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/brand`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.request(optionGetBrands)
      .then((response) => {
        setListBrand(response.data.data)
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

  const createBrand = async () => {
    setLoading(true)

    const optionCreateBrand = {
      method: 'post',
      url: `${BASE_API_WAREOHUSE}/brand`,
      data: detailBrand,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionCreateBrand)
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

        setLoading(false)
      })
  }

  const updateBrand = async () => {
    setLoading(true)
    const brandCode = window.btoa(detailBrand.fc_brandcode)

    const optionUpdate = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/brand/${brandCode}`,
      data: {
        fv_brandname: detailBrand.fv_brandname,
        fv_group: detailBrand.fv_group,
        ft_image: detailBrand.ft_image,
        ft_description: detailBrand.ft_description
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdate)
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

        setLoading(false)
      })
  }

  const deleteBrand = async () => {
    setLoading(true)
    setDialogConfirm(false)
    const brandCode = window.btoa(detailBrand.fc_brandcode)

    const optionUpdate = {
      method: 'delete',
      url: `${BASE_API_WAREOHUSE}/brand/${brandCode}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionUpdate)
      .then(() => {
          setRefresh(!refresh)
          resetData()
          setLoading(false)
      })
      .catch((error) => {
        setErrorAttribut({
          visibility: true,
          headerTitle: "Gagal Delete",
          errorMessage: error.response.data.message
        })

        setLoading(false)
      })
  }

  const saveHandler = () => {
    setDialogAddUpdate(false)
    if (statusAction === "CREATE") createBrand()
    if (statusAction === "UPDATE") updateBrand()
  }

  const resetData = () => { 
    setDetailBrand({
      fc_brandcode: "",
      fv_brandname: "",
      fv_group: null,
      ft_image: "",
      ft_description: ""
    })
  }

  useEffect(() => {
    getAllBrand()
  }, [refresh])

  const templateDescription = (data) => {
    return data === null ? " - ": data;
  }

  const templateLogo = (data) => {
    return <img src={data.ft_image} alt={data.fv_brandname} width="80px"/>
  }

  const actionBodyTemplate = (data) => (
    <div className="d-flex gap-2">
      <Button className='buttonAction' outlined icon="pi pi-eye" severity='success'/>
      <Button className='buttonAction' icon="pi pi-pencil" severity='primary' onClick={() => showDialog("UPDATE", data)}/>
      <Button className='buttonAction' outlined icon="pi pi-trash" severity='danger' onClick={() => showDialog("DELETE", data)}/>
    </div>
  )

  const renderHeader = () => {
    return (
        <TableHeader onGlobalFilterChange={onGlobalFilterChange} labelButton={"Tambah Brand"} 
         globalFilterValue={globalFilterValue} actionButton={() => showDialog("CREATE")} iconHeader={"far fa-copyright iconHeader"}/>
    );
  };

  const hideDialog = (type) => {
    if (type === "CONFIRM") setDialogConfirm(false)
    if (type === "CREATE" || type === "UPDATE") setDialogAddUpdate(false)
    resetData()
  }

  const showDialog = (type, data) => {
    if (data) {
      setDetailBrand((currentData) => ({
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
      setDetailBrand((currentData) => ({
        ...currentData,
        fc_brandcode: data.fc_brandcode
      }))

      setDialogConfirm(true)
    }
  }

  const footerDialogAddUpdate = () => {
    return (
      <React.Fragment>
          <Button label="Cancel" icon="pi pi-times" outlined onClick={() => hideDialog("CREATE")} className='mr-3'/>
          <Button label="Save" icon="pi pi-check" onClick={() => saveHandler()}/>
      </React.Fragment>
    )
  }

  return (
    <PageLayout>
      <Loading visibility={loading}/>
      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>
      
      <ConfirmDialog visibility={dialogConfirm} submitAction={() => deleteBrand()} cancelAction={() => hideDialog("CONFIRM")} confirmMessage={"Yakin ingin menghapus Brand ini?"} 
       iconConfirm="pi pi-exclamation-triangle" headerTitle="Hapus Brand" />
      
      <Dialog header="Brand" visible={dialogAddUpdate} style={{ width: '32rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
       onHide={() => hideDialog("UPDATE")} footer={footerDialogAddUpdate}
      >
        <div className='flex-auto mb-3'>
          <label htmlFor="fv_brandname" className='font-bold block mb-2'>Nama Brand</label>
          <InputText id='fv_brandname' name='fv_brandname' value={detailBrand.fv_brandname} onChange={(e) => OnChangeValue(e, setDetailBrand)} className='w-full' required autoFocus/>
        </div>
        <div className='flex-auto mb-3'>
          <label htmlFor="fv_group" className='font-bold block mb-2'>Group</label>
          <Dropdown options={groupBrand} id='fv_group' name='fv_group' value={detailBrand.fv_group} onChange={(e) => OnChangeValue(e, setDetailBrand)} 
           className='w-full' filter placeholder='Pilih Group' required autoFocus/>
        </div>
        <div className='flex-auto mb-3'>
          <label htmlFor="ft_image" className='font-bold block mb-2'>Nama Brand</label>
          <InputText id='ft_image' name='ft_image' value={detailBrand.ft_image} onChange={(e) => OnChangeValue(e, setDetailBrand)} className='w-full' required autoFocus/>
          <div className='text-center'>
           <Image src={detailBrand.ft_image} className="mt-3" alt="Gambar-Brand" width='250' preview/>
          </div>
        </div>
        <div className='flex-auto mb-3'>
          <label htmlFor="ft_description" className='font-bold block mb-2'>Deskripsi</label>
          <InputTextarea id='ft_description' name='ft_description' value={detailBrand.ft_description} onChange={(e) => OnChangeValue(e, setDetailBrand)} rows={3} className='w-full' required autoFocus/>
        </div>
      </Dialog>
      
      <Card title="Daftar Brand">
        <DataTable value={listBrand} tablestyle={{minwidth:'50rem'}} paginator rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_brandcode' scrollable header={renderHeader}
          filters={filters} globalFilterFields={['fv_brandname', 'fv_group']} removableSort
        >
          <Column field='fv_brandname' header="Nama Brand" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fv_group' header="Group Stock" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='ft_image' header="Logo" body={templateLogo} style={{maxWidth: '15rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '10rem'}}></Column>
          <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default MasterBrand
