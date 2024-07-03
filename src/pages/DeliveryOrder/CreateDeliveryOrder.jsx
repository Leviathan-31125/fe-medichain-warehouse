import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { Card } from 'primereact/card'
import { BASE_API_WAREOHUSE, formattedDateWithOutTime, getSeverity } from '../../helpers'
import axios from 'axios'
import { Column } from 'primereact/column'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'

const CreateDeliveryOrder = () => {
  const [loading, setLoading] = useState(false)
  const [listSO, setListSO] = useState([])
  const [errorAttribut, setErrorAttribut] = useState({
    visibility: false, 
    headerTitle: "", 
    errorMessage: ""
  })
  const navigate = useNavigate()

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

  const getAllSOAvaialable = async () => {
    setLoading(true)
    
    const optionGetAllSO = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/delivery-order/sales-order`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetAllSO)
      .then((response) => {
        const listAllSO = response.data.data
        listAllSO.map((so) => {
          so.fd_sodate_user = formattedDateWithOutTime(so.fd_sodate_user)
          so.fd_soexpired = formattedDateWithOutTime(so.fd_soexpired)
          return so
        })

        setListSO(listAllSO)
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

  const getDataTempDOMST = async () => {
    const fc_dono = window.btoa(localStorage.getItem('userId'));

    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/delivery-order/temp-do-mst/do/${fc_dono}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        if (response.data.status) 
          navigate('/delivery-order/create');
      })
  }

  useEffect(() => {
    getDataTempDOMST()
    getAllSOAvaialable()
  }, [])

  const renderHeader = () => {
    return (
      <div>
          <div className="searchBarLayout">
              <div className="cardHeader">
                <i className="fas fa-truck-moving iconHeader"></i>
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


  const actionBodyTemplate = (data) => (
    <Button className='buttonAction' label='Pilih' severity='info' onClick={() => redirectDetailSO(data)}/>
  )

  const redirectDetailSO = (data) => {
    navigate('/delivery-order/detail-so', {state: data})
  }

  const statusTemplate = (rowdata) => (
    <Tag value={rowdata} severity={getSeverity("STATUS", rowdata)}></Tag>
  )

  return (
    <PageLayout>
      <Loading visibility={loading} />

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Card>
        <DataTable value={listSO} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_sono' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['fc_sono', 'fc_sotype', 'customer.fv_membername', 'fd_sodate_user' , 'fd_soexpired', 'fv_member_address_loading', 'fn_sodetail']}>
            <Column field='fc_sono' header="NO. SO" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fc_sotype' header="Tipe SO" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='customer.fv_membername' header="Customer" sortable style={{minWidth: '17rem'}}></Column>
            <Column field='fd_sodate_user' header="Tanggal Terbit" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fd_soexpired' header="Expired" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fv_member_address_loading' header="Alamat Pengiriman" sortable style={{minWidth: '20rem'}}></Column>
            <Column field='fc_status' header="Status" body={(data) => statusTemplate(data.fc_status)} sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fn_sodetail' header="Qty Detail" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='ft_description' header="Deskripsi" sortable style={{minWidth: '12rem'}}></Column>
            <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default CreateDeliveryOrder
