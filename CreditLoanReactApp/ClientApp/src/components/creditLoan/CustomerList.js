import React, { useState, useRef, useEffect } from "react";
import ExportCsv from './ExportCsv';
import ExportExcel from "./ExportExcel";

function CustomerList() {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);    
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setShowForm(true);
            const storedToken = token;
            if (storedToken) {
                setToken(storedToken);
            }
        }
        else {
            setShowForm(false);
            setPageMessage('Unauthorized, please login');
        }
    }, []);

    return (
        <div className="main-page">
            <h3 id="tabelLabel" >List Customer</h3>
            <p>This Page display all customer.</p>
            <hr />
            {showForm &&
                <FormDetail 
                users={users} setUsers={setUsers}
                pageMessage={pageMessage} setPageMessage={setPageMessage}
                btnDisabled={btnDisabled} setBtnDisabled={setBtnDisabled}
                />
            }
            {pageMessage && (
                <div className="alert alert-info text-center" role="alert">
                    {pageMessage}
                </div>
            )}
        </div>
    );
}



const FormDetail = ({ users, setUsers, setPageMessage, btnDisabled, setBtnDisabled }) => {
    const tableRef = useRef(null);
    const [page, setpage] = useState(1);
    const [pageSize, setpageSize] = useState(10);
    const [searchId, setSearchId] = useState('');

    const handleList = async (event) => {

        try {
            //start fetch
            event.preventDefault();
            console.log(page);
            console.log(pageSize);
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_CUSTOMER + 'list?page=' + page + '&pageSize=' + pageSize;
            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                }
            });

            const data = await response.json();
            console.log('try sync data...');
            if (response.ok) {
                console.log(data);
                if (data['data'] != null) {
                    setUsers(data['data']);
                    setPageMessage(data.message);
                    setBtnDisabled(false);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
                else {
                    setPageMessage(data.message);
                    setBtnDisabled(true);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
            } else {
                //const err = await response.json();
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage(data['message']);
                setBtnDisabled(true);
                setTimeout(() => { setPageMessage('') }, 2000);
            }

            //end fetch
        }
        catch (e) {
            console.log('page error.....');
            setPageMessage(e.message);
        }

    }


    const handleSearch = async (event) => {
        if (users.customerId === '') {
            event.preventDefault();
            setPageMessage('Isi Customer Id');
            setTimeout(() => { setPageMessage('') }, 2000);
            return;
        }

        try {
            //start fetch
            event.preventDefault();
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_CUSTOMER + searchId;
            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                }
            });

            const data = await response.json();
            console.log('try bind data...');
            if (response.ok) {
                console.log(data);
                if (data['data'] != null) {
                    setUsers(data['data']);
                    setPageMessage(data.message);
                    setTimeout(() => { setPageMessage('') }, 2000);
                    //DbLogger('organizer_create_ok', 'CREATE', 'Success to create data from ' + apiUrl, '-', response.status);
                }
                else {
                    setPageMessage(data.message);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
            } else {
                //const err = await response.json();
                //DbLogger('organizer_create_failed', 'CREATE', 'Failed to create data from ' + apiUrl, err['message'], err['status_code']);
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage('Search data failed!');
                setTimeout(() => { setPageMessage('') }, 2000);
            }

            //end fetch
        }
        catch (e) {
            console.log('page error.....');
            //setPageMessage('An error occurred while processing');
            setPageMessage(e.message);
        }

    }

    const handleSearchIdChange = (event) => {
        setSearchId(event.target.value);
        setUsers([]);
    };


    const handlepageChange = (event) => {
        setpage(event.target.value);
        setUsers([]);
    };

    const handlepageSizeChange = (event) => {
        setpageSize(event.target.value);
        setUsers([]);
    };

    return (
        <div>
            <div className="row">
                <div className="col-8 text-start">
                    <ExportExcel excelData={users} fileName="list-customer" disabled={btnDisabled} />
                    <ExportCsv data={users} fileName="list-customer" disabled={btnDisabled} />
                </div>
                <div className="col-4 justify-content-end d-flex">
{/*
                    <input type="text" placeholder="Customer id" value={searchId} onChange={handleSearchIdChange} />
                    <button className="btn btn-secondary" onClick={handleSearch} title="search data"> <i className="fa fa-search"></i></button>
                    <input type="number" min="1" max="12" value={page} onChange={handlepageChange} required></input>
                    <input type="number" placeholder="page size"value={pageSize} onChange={handlepageSizeChange} required></input>


*/}
                    <button onClick={handleList} className="btn btn-success"> <i className="fa fa-search"></i>&nbsp; Show</button>
                </div>
            </div>
            <table className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Cust Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">PhoneNumber</th>
                        <th scope="col">Address</th>
                        <th scope="col">Balance</th>
                        <th scope="col">loan Amount</th>
                        <th scope="col">Tenor</th>
                        <th scope="col">Outstanding</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">iRate</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(users => (
                        <tr key={users.customerId}>
                            <td width="80">{users.customerId}</td>
                            <td>{users.name}</td>
                            <td>{users.email}</td>
                            <td>{users.phoneNumber}</td>
                            <td>{users.address}</td>
                            <td>{users.balance.toLocaleString()}</td>
                            <td>{users.loanAmount.toLocaleString()}</td>
                            <td>{users.tenor}</td>
                            <td>{users.outstanding.toLocaleString()}</td>
                            <td>{users.dueDate.replace('T00:00:00', '')}</td>
                            <td>{users.interestRate.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default CustomerList;
