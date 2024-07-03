import { Tag } from "primereact/tag";

export const SERVICE_KEY = "CB3fY15iUzH4adLuLYwdknCZYtTDUf90";
export const BASE_API_WAREOHUSE = "http://34.171.218.254/api";

export const checkAuth = () => {
    const isLogin = localStorage.getItem('accessToken');
    
    if(isLogin) return true;
    return false;
}

export const formattedDateWithOutTime = (date) => { 
    const newDate = new Date(date)
    const formattedDate = newDate.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const fullDate = formattedDate
    return fullDate
}

export const newFormatDate = (currentDate) => {
    const newDate = new Date(currentDate)
    return newDate;
}

export const formatDateToDB = (currentDate) => {
    const date = new Date(currentDate)
    date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));

    let dateAsString =  date.toISOString().split('T')[0]
    return dateAsString
}

export const getSeverity = (type, value) => {
    if(type === "STATUS") {
        switch (value) {
            case "SUBMIT":
                return "primary"
            case "PROCESS": 
                return "warning"
            case "LOCK":
                return "danger"
            case "FINISH":
                return "success"
            default:
                return "primary"
        }
    }

    if (type === "STATUS_BONUS"){
        switch (value) {
            case 'F':
                return <Tag value="Reguler" severity="success"></Tag>
        
            default:
                return <Tag value="Bonus" severity="info"></Tag>
        }
    }

    if (type === "TYPE_STOCK") {
        switch (value) {
            case "REAGEN":
                return "danger"
            case "CONSUMABLE": 
                return "info"
            case "ALAT":
                return "warning"
            case "SPAREPART":
                return "success"
            default:
                return "primary"
        }
    }
}

export const groupBrand = [
    "REAGEN", "CONSUMABLE", "ALAT", "SPAREPART"
]

export const OnChangeValue = (event, setValue) => {
    const {name, value} = event.target;
    
    setValue((currentValue) => ({
        ...currentValue,
        [name]: value
    }));
}