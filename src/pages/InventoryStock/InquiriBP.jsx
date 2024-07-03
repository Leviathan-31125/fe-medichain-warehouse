import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import Loading from '../../components/Loading/Loading'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FilterMatchMode } from 'primereact/api'
import { BASE_API_WAREOHUSE, formatDateToDB, getSeverity } from '../../helpers'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import axios from 'axios'
import { Tag } from 'primereact/tag'

const InquiriBP = () => {
  const [loading, setLoading] = useState(false)
  const [listInquiry, setListInquiry] = useState([])
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
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

  const getInquiryStock = async () => {
    setLoading(true)

    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/invstore/inquiry/all`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        setListInquiry(response.data);
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
    getInquiryStock()
  }, [])

  const renderHeader = () => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className="fas fa-chart-line iconHeader"></i>
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

  const inOutTemplate = (data) => {
    if(data.fn_in != 0){
      return <span>{data.fn_in} <i className="fas fa-level-up-alt" style={{color: 'green', fontSize: '20px'}}></i></span>
    } else {
      return <span>{data.fn_out} <i className="fas fa-level-down-alt" style={{color: 'red', fontSize: '20px'}}></i></span>
    }
  }

  const typeStockTemplate = (data) => (
    <Tag value={data.invstore.stock.fc_typestock} severity={getSeverity("TYPE_STOCK", data.invstore.stock.fc_typestock)}></Tag>
  )

  return (
    <PageLayout>
      <Loading visibility={loading} />

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Card>
        <DataTable value={listInquiry} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_inquirycode' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['invstore.stock.fc_stockcode', 'invstore.stock.fv_namestock', 'invstore.stock.fc_typestock', 'invstore.fc_batch', 'invstore.fd_expired', 'fn_balance', 'warehouse.fv_warehousename', 'fc_doceference', 'fd_date']}>
            <Column field='invstore.stock.fc_stockcode' header="Katalog" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='invstore.stock.fv_namestock' header="Nama Stok" sortable style={{minWidth: '13rem'}}></Column>
            <Column field='invstore.stock.fc_typestock' body={typeStockTemplate} header="Tipe" sortable style={{minWidth: '9rem'}}></Column>
            <Column field='invstore.fc_batch' header="Batch" sortable style={{minWidth: '8rem'}}></Column>
            <Column field='invstore.fd_expired' header="Expired" sortable style={{minWidth: '8rem'}}></Column>
            <Column header="Status" body={inOutTemplate} style={{minWidth: '5rem'}}></Column>
            <Column field='fn_balance' header="Saldo" sortable style={{minWidth: '5rem'}}></Column>
            <Column field='warehouse.fv_warehousename' header="Gudang" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fc_doceference' header="Referensi" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fd_date' body={(data) => formatDateToDB(data.fd_date)} header="Tanggal" sortable style={{minWidth: '10rem'}}></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default InquiriBP
