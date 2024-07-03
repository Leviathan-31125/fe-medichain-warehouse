import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { Card } from 'primereact/card'
import Loading from '../../components/Loading/Loading'
import { BASE_API_WAREOHUSE } from '../../helpers'
import axios from 'axios'
import { FilterMatchMode } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

const InventoryStock = () => {
  const [loading, setLoading] = useState(false)
  const [detailDialog, setDetailDialog] = useState(false)
  const [listWarehouseInv, setListWarehouseInv] = useState([])
  const [listDetailInventory, setListDetailInventory] = useState([])
  const [titleWarehouse, setTitleWarehouse] = useState('');
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

  const getAllWarehouseInvStore = async () => {
    setLoading(true)

    const optionGetAllWarehouseInv = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/warehouse/invstore/list`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetAllWarehouseInv)
      .then((response) => {
        const listData = response.data.data
        listData.map((data) => (
          data.qty_inventory = data.invstore.length
        ));

        setListWarehouseInv(listData)
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

  useEffect(() => {
    getAllWarehouseInvStore()
  }, [])

  const detailInventory = (data) => {
    setTitleWarehouse(data.fv_warehousename)
    setListDetailInventory(data.invstore)
    setDetailDialog(true)
  }

  const renderHeader = () => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className="fas fa-boxes iconHeader"></i>
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

  const actionBodyTemplate = (data) => (
    <Button className='buttonAction' outlined icon="pi pi-eye" onClick={() => detailInventory(data)}/>
  )

  return (
    <PageLayout>
      <Loading visibility={loading}/>

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Dialog header={titleWarehouse} visible={detailDialog} style={{ width: '70rem' }} breakpoints={{ '960px': '75vm', '641px': '90vw' }}
       onHide={() => setDetailDialog(false)}>
        <DataTable value={listDetailInventory} tablestyle={{minwidth:'70rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_barcode' scrollable header={renderHeaderDetail} filters={invstoreFilters} 
          globalFilterFields={['fc_stockcode', 'stock.fv_namestock', 'stock.fv_namealias_stock', 'stock.fv_group', 'stock.fc_formstock', 'fn_quantity', 'stock.fc_namepack', 'fd_expired', 'fc_batch', 'ft_description']}>
            <Column field='fc_stockcode' header="Katalog" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '15rem'}}></Column>
            <Column field='stock.fv_namealias_stock' header="Nama Alias" sortable style={{minWidth: '15rem'}}></Column>
            <Column field='stock.fv_group' header="Grup" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='stock.fc_formstock' header="Wujud" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fn_quantity' header="Qty" sortable style={{minWidth: '5rem'}}></Column>
            <Column field='stock.fc_namepack' header="Satuan" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fd_expired' header="Expired" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fc_batch' header="Kode Batch" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='ft_description' header="Deskripsi" sortable style={{minWidth: '8rem'}}></Column>
        </DataTable>
      </Dialog>

      <Card title="Persediaan">
        <DataTable value={listWarehouseInv}tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_warehousecode' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['fv_warehousename', 'fc_position', 'fv_warehouseaddress', 'qty_inventory']}>
            <Column field='fv_warehousename' header="Nama Gudang" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fc_position' header="Status" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fv_warehouseaddress' header="Alamat" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='qty_inventory' header="Jenis Stok" sortable style={{minWidth: '8rem'}}></Column>
            <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default InventoryStock
