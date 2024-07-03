import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import Loading from '../../components/Loading/Loading'
import ErrorDialog from '../../components/Dialog/ErrorDialog'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { FilterMatchMode } from 'primereact/api'
import { BASE_API_WAREOHUSE, formatDateToDB, getSeverity } from '../../helpers'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MasterDeliveryOrder = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listDO, setListDO] = useState([])
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

  const getMasterDO = async () => {
    setLoading(true)

    const optionGetData = {
      method: 'get',
      url: `${BASE_API_WAREOHUSE}/delivery-order/domst`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }

    await axios.request(optionGetData)
      .then((response) => {
        response.data.map((domst) => (
          domst.fd_dodate_user = formatDateToDB(domst.fd_dodate_user)
        ))

        setListDO(response.data);
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
    getMasterDO()
  }, [])

  const actionBodyTemplate = (data) => (
    <React.Fragment>
      <Button className='buttonAction' icon="pi pi-eye" severity='info' outlined onClick={() => redirectDetailDO(data)}/>
    </React.Fragment>
  )

  const statusTemplate = (rowdata) => (
    <Tag value={rowdata} severity={getSeverity("STATUS", rowdata)}></Tag>
  )

  const redirectDetailDO = (data) => {
    navigate('/master-do/detail', {state: data})
  }

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

  return (
    <PageLayout>
      <Loading visibility={loading} />

      <ErrorDialog visibility={errorAttribut.visibility} errorMessage={errorAttribut.errorMessage} headerTitle={errorAttribut.headerTitle} setAttribute={setErrorAttribut}/>

      <Card>
        <DataTable value={listDO} tablestyle={{minwidth:'50rem'}} paginator rows={5} removableSort
          rowsPerPageOptions={[5, 10, 25, 50]} dataKey='fc_dono' scrollable header={renderHeader} filters={filters} 
          globalFilterFields={['fc_sono', 'fc_sotype', 'customer.fv_membername', 'fd_sodate_user' , 'fd_soexpired', 'fv_member_address_loading', 'fn_sodetail']}>
            <Column field='fc_sono' header="NO. SO" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fc_dono' header="No. DO" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='fd_dodate_user' header="Tanggal DO" sortable style={{minWidth: '10rem'}}></Column>
            <Column field='somst.customer.fv_membername' header="Customer" sortable style={{minWidth: '17rem'}}></Column>
            <Column field='fv_memberaddress_loading' header="Alamat Pengiriman" sortable style={{minWidth: '17rem'}}></Column>
            <Column field='fv_transporter' header="Transporter" sortable style={{minWidth: '12rem'}}></Column>
            <Column field='fc_status' header="Status" body={(data) => statusTemplate(data.fc_status)} sortable style={{minWidth: '8rem'}}></Column>
            <Column field='fn_dodetail' header="Detail" sortable style={{minWidth: '5rem'}}></Column>
            <Column field='ft_description' header="Deskripsi" sortable style={{minWidth: '12rem'}}></Column>
            <Column body={actionBodyTemplate} ></Column>
        </DataTable>
      </Card>
    </PageLayout>
  )
}

export default MasterDeliveryOrder
