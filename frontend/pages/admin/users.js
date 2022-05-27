import axios from 'axios';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "@material-table/core";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
// import Alert from '@material-ui/lab/Alert';
import { forwardRef } from 'react';
import qs from 'qs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
    baseURL: `http://localhost:3001`
})

export default function CrudUsers({ user }) {

    const router = useRouter();

    const columns = [
        { title: "id", field: "_id", hidden: true },
        { title: "Username", field: "username" },
        { title: "Email", field: "email" },
        { title: "Admin", field: "is_admin" }
    ];
    const [data, setData] = useState([]);
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {

        if (!user) {
            router.push('/login')
        } else if (!user.is_admin) {
            router.push('/')
        } else {

            const options = {
                method: 'GET',
                url: 'http://localhost:3001/users',
            };

            axios(options)
                .then(res => {
                    console.log(res.data)
                    setData(res.data)
                })
                .catch(error => {
                    console.log(error)
                    setErrorMessages(["Cannot load user data"])
                    setIserror(true)
                })
        }
        return
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if (newData.username === "") {
            errorList.push("Please enter username")
        }
        if (newData.email === "") {
            errorList.push("Please enter a valid email")
        }


        if (newData.is_admin != "true"
            // || newData.is_admin != "false"
        ) {
            newData.is_admin = "false"
        }

        if (errorList.length < 1) {

            const options = {
                method: 'PUT',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(newData),
                url: 'http://localhost:3001/users/' + newData._id
            };

            axios(options)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setIserror(true)
                    resolve()

                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }

    }

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.username === undefined) {
            errorList.push("Please enter first name")
        }
        if (newData.email === undefined) {
            errorList.push("Please enter a valid email")
        }

        newData.password = "password"

        if (newData.is_admin != "true") {
            newData.is_admin = "false";
        }
        console.log(newData)
        if (errorList.length < 1) {

            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(newData),
                url: 'http://localhost:3001/signup'
            };
            console.log("options", newData)

            axios(options)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    setIserror(true)
                    resolve()
                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }

    const handleRowDelete = (oldData, resolve) => {
        api.delete("/users/" + oldData._id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData._id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve()
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
                resolve()
            })
    }

    const handleCloseWidget = () => {
        const updatedWidgets = widgets.filter((w) => w.id !== id);
        console.log(updatedWidgets);
        setWidgets(updatedWidgets);
    }

    return (
        <Box sx={{ width: 800, mx: 3, my: 3 }}>
            <MaterialTable
                style={{ width: 800 }}
                title="User list"
                columns={columns}
                data={data}
                icons={tableIcons}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                        }),
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            handleRowAdd(newData, resolve)
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve)
                        }),
                }}
            />
        </Box>
    )

}