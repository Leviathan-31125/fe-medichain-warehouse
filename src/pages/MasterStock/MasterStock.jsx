import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
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
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import ErrorDialog from '../../components/Dialog/ErrorDialog';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';
import { InputNumber } from 'primereact/inputnumber';

const MasterStock = () => {
  const [listStock, setListStock] = useState([])
  const [listBrand, setListBrand] = useState([])
  const [listNamePack, setListNamePack] = useState([])
  const [listFormStock, setListFormStock] = useState([])
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
  const [detailStock, setDetailStock] = useState({
    fc_barcode: null,
    fc_stockcode: "",
    fv_namestock: "",
    fv_namealias_stock: "",
    fc_brandcode: null,
    fv_group: null,
    fc_typestock: null,
    fc_formstock: null,
    fc_namepack: null,
    fn_minstock: null,
    fn_maxstock: null,
    fm_purchase: null,
    fm_sales: null,
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

  const getAllStock = async () => {
    setLoading(true)
    const optionGetStock = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/stock`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetStock)
      .then((response) => {
        setListStock(response.data.data)
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

  const createStock = async () => {
    const optionCreateStock = {
      method: 'post',
      url: `${BASE_API_WAREOHUSE}/stock`,
      data: {
        ...detailStock,
        fv_group: listBrand.filter((brand) => brand.fc_brandcode === detailStock.fc_brandcode)[0].fv_group,
        fc_typestock: listBrand.filter((brand) => brand.fc_brandcode === detailStock.fc_brandcode)[0].fv_group
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionCreateStock)
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

  const updateStock = async () => {
    const barCode = window.btoa(detailStock.fc_barcode)

    const optionUpdate = {
      method: 'put',
      url: `${BASE_API_WAREOHUSE}/stock/${barCode}`,
      data: {
        fv_namestock: detailStock.fv_namestock,
        fv_namealias_stock: detailStock.fv_namealias_stock,
        fc_brandcode: detailStock.fc_brandcode,
        fv_group: detailStock.fv_group,
        fc_typestock: detailStock.fc_typestock,
        fc_formstock: detailStock.fc_formstock,
        fc_namepack: detailStock.fc_namepack,
        fn_minstock: detailStock.fn_minstock,
        fn_maxstock: detailStock.fn_maxstock,
        fm_purchase: detailStock.fm_purchase,
        fm_sales: detailStock.fm_sales,
        ft_description: detailStock.ft_description
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

  const deleteStock = async () => {
    setLoading(true)
    setDialogConfirm(false)
    const barCode = window.btoa(detailStock.fc_barcode)

    const optionUpdate = {
      method: 'delete',
      url: `${BASE_API_WAREOHUSE}/stock/${barCode}`,
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

  const getNamePack = async () => {
    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/general/get-name-pack`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        setListNamePack(response.data.data)
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

  const getFormStock = async () => {
    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/general/get-form-stock`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        setListFormStock(response.data.data)
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

  const saveHandler = () => {
    setDialogAddUpdate(false)

    if (statusAction === "CREATE") createStock()
    if (statusAction === "UPDATE") updateStock()
  }

  const resetData = () => { 
    setDetailStock({
      fc_barcode: null,
      fc_stockcode: "",
      fv_namestock: "",
      fv_namealias_stock: "",
      fc_brandcode: null,
      fv_group: null,
      fc_typestock: null,
      fc_formstock: null,
      fc_namepack: null,
      fn_minstock: null,
      fn_maxstock: null,
      fm_purchase: null,
      fm_sales: null,
      ft_description: ""
    })
  }

  useEffect(() => {
    getAllStock()
  }, [refresh])

  useEffect(() => {
    getAllBrand()
    getNamePack()
    getFormStock()
  }, [])

  const templateDescription = (data) => {
    return data === null ? " - ": data;
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
        <TableHeader onGlobalFilterChange={onGlobalFilterChange} labelButton={"Tambah Stock"} 
         globalFilterValue={globalFilterValue} actionButton={() => showDialog("CREATE")} iconHeader={"fas fa-cubes iconHeader"}/>
    );
  };

  const hideDialog = (type) => {
    if (type === "CONFIRM") setDialogConfirm(false)
    if (type === "CREATE" || type === "UPDATE") setDialogAddUpdate(false)
    resetData()
  }

  const showDialog = (type, data) => {
    if (data) {
      setDetailStock((currentData) => ({
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
      setDetailStock((currentData) => ({
        ...currentData,
        fc_barcode: data.fc_barcode
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
      
      <ConfirmDialog visibility={dialogConfirm} submitAction={() => deleteStock()} cancelAction={() => hideDialog("CONFIRM")} confirmMessage={"Yakin ingin menghapus Stock ini?"} 
       iconConfirm="pi pi-exclamation-triangle" headerTitle="Hapus Stock" />
      
      <Dialog header="Stok Action" visible={dialogAddUpdate} style={{ width: '50rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
       onHide={() => hideDialog("UPDATE")} footer={footerDialogAddUpdate}
      >
        <div className='d-flex gap-2'>
          <div className='flex-auto mb-3'>
            <label htmlFor="fc_stockcode" className='font-bold block mb-2'>Kode Katalog</label>
            <InputText id='fc_stockcode' name='fc_stockcode' value={detailStock.fc_stockcode} onChange={statusAction === "CREATE" ? (e) => OnChangeValue(e, setDetailStock) : () => ('')} 
            className='w-full' required autoFocus/>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fc_brandcode" className='font-bold block mb-2'>Brand</label>
            <Dropdown options={listBrand} optionLabel='fv_brandname' optionValue='fc_brandcode' id='fc_brandcode' name='fc_brandcode' value={detailStock.fc_brandcode} onChange={(e) => OnChangeValue(e, setDetailStock)} 
            className='w-full' filter placeholder='Pilih Brand' required autoFocus/>
          </div>
        </div>
        
        <div className='flex-auto mb-3'>
          <label htmlFor="fv_namestock" className='font-bold block mb-2'>Nama Stok</label>
          <InputText id='fv_namestock' name='fv_namestock' value={detailStock.fv_namestock} onChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full' required autoFocus/>
        </div>

        <div className='flex-auto mb-3'>
          <label htmlFor="fv_namealias_stock" className='font-bold block mb-2'>Nama Alias Stok</label>
          <InputText id='fv_namealias_stock' name='fv_namealias_stock' value={detailStock.fv_namealias_stock} onChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full' required autoFocus/>
        </div>

        <div className='flex flex-wrap gap-2 p-fluid'>
          <div className='flex-auto mb-3'>
            <label htmlFor="fc_formstock" className='font-bold block mb-2'>Wujud Stok</label>
            <Dropdown options={listFormStock} id='fc_formstock' name='fc_formstock' value={detailStock.fc_formstock} onChange={(e) => OnChangeValue(e, setDetailStock)} 
            className='w-full' optionLabel='fc_information' optionValue='fc_trxcode' placeholder='Pilih Wujud' required autoFocus/>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fc_namepack" className='font-bold block mb-2'>Satuan</label>
            <Dropdown options={listNamePack} id='fc_namepack' name='fc_namepack' value={detailStock.fc_namepack} onChange={(e) => OnChangeValue(e, setDetailStock)} 
            className='w-full' optionLabel='fc_information' optionValue='fc_trxcode' filter placeholder='Pilih Satuan' required autoFocus/>
          </div>
        </div>

        <div className='flex flex-wrap gap-2 p-fluid'>
          <div className='flex-auto mb-3'>
            <label htmlFor="fn_minstock" className='font-bold block mb-2'>Min. Hold Stok</label>
            <InputNumber id='fn_minstock' name='fn_minstock' value={detailStock.fn_minstock} onValueChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full' min={0} required autoFocus/>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fn_maxstock" className='font-bold block mb-2'>Max. Hold Stok</label>
            <InputNumber id='fn_maxstock' name='fn_maxstock' value={detailStock.fn_maxstock} onValueChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full' min={0} required autoFocus/>
          </div>
        </div>

        <div className='flex flex-wrap gap-2 p-fluid'>
          <div className='flex-auto mb-3'>
            <label htmlFor="fm_purchase" className='font-bold block mb-2'>Harga Beli</label>
            <InputNumber id='fm_purchase' name='fm_purchase' value={detailStock.fm_purchase} onValueChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full' 
            min={0} maxFractionDigits={4} mode='currency' currency='IDR' locale='id-ID' required autoFocus/>
          </div>

          <div className='flex-auto mb-3'>
            <label htmlFor="fm_sales" className='font-bold block mb-2'>Harga Jual</label>
            <InputNumber id='fm_sales' name='fm_sales' value={detailStock.fm_sales} onValueChange={(e) => OnChangeValue(e, setDetailStock)} className='w-full'
            min={0} maxFractionDigits={4} mode='currency' currency='IDR' locale='id-ID' required autoFocus/>
          </div>
        </div>

        <div className='flex-auto mb-3'>
          <label htmlFor="ft_description" className='font-bold block mb-2'>Deskripsi</label>
          <InputTextarea id='ft_description' name='ft_description' value={detailStock.ft_description} onChange={(e) => OnChangeValue(e, setDetailStock)} rows={3} className='w-full' required autoFocus/>
        </div>
      </Dialog>
      
      <Card title="Daftar Stok">
        <DataTable value={listStock} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['fc_stockcode', 'fv_namestock', 'fv_namealias_stock', 'brand.fv_brandname', 'fc_typestock', 'fc_formstock', 'fc_namepack', 'fn_maxstock', 'fn_minstock', 'fm_purchase', 'fm_sales']}
        >
          <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '12rem'}}></Column>
          <Column field='fv_namestock' header="Nama Stok" sortable style={{minWidth: '15rem'}}></Column>
          <Column field='fv_namealias_stock' header="Nama Alias" sortable style={{minWidth: '15rem'}}></Column>
          <Column field='brand.fv_brandname' header="Nama Brand" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fc_typestock' header="Tipe Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fc_formstock' header="Wujud Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fc_namepack' header="Satuan Stok" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fn_minstock' header="Min. Hold" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fn_maxstock' header="Max. Hold" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fm_purchase' header="Harga Beli" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='fm_sales' header="Harga Jual" sortable style={{minWidth: '10rem'}}></Column>
          <Column field='ft_description' header="Deskripsi" sortable body={(data) => templateDescription(data.ft_description)} style={{minWidth: '10rem'}}></Column>
          <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default MasterStock
