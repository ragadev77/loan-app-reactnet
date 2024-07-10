//import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import ExportCsv from "./exports/ExportCsv"
import ExportExcel from "./exports/ExportExcel";
import CustomerDetailDialog from "./dialogs/CustomerDetailDialog";

function Customer() {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);    
    const initialHeader = {
        customerId: '',
        loanAmount: '',
        tenor: '',
        interestRate: '',
        loanDate: ''
    };
    const [header, setCustomers] = useState(initialHeader);
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [selectedRec, setSelectedRec] = useState('');

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
                <FormMain 
                users={users} setUsers={setUsers}
                pageMessage={pageMessage} setPageMessage={setPageMessage}
                btnDisabled={btnDisabled} setBtnDisabled={setBtnDisabled}
                showDialog={showDialog} setShowDialog={setShowDialog}
                selectedRec={selectedRec} setSelectedRec={setSelectedRec}
                />
            }
            {pageMessage && (
                <div className="alert alert-info text-center" role="alert">
                    {pageMessage}
                </div>
            )}
            {showDialog && (<CustomerDetailDialog setShowDialog={setShowDialog} selectedRec={selectedRec} setSelectedRec={setSelectedRec} />)}            

        </div>
    );
}

const FormMain = ({ users, setUsers, setPageMessage, btnDisabled, setBtnDisabled, showDialog, setShowDialog, selectedRec, setSelectedRec } ) => {
    const tableRef = useRef(null);
    const [page, setpage] = useState(1);
    const [pageSize, setpageSize] = useState(10);
    const initSearchParams = { page: 1, pageSize: 10, nameEmail: '', loanAmount: 0, balance: 0, status: ''}
    const [searchParams, setSearchParams] = useState(initSearchParams);
    //temp 

    const handleLookup = useCallback( (row) => {
        return async (e) => {
            e.preventDefault();
            setShowDialog(true);
            setSelectedRec(row.customerId);
        }
    },[showDialog, selectedRec]); 

    const handleSearch = async (event) => {
        try {
            console.log(searchParams);
            //start fetch
            setPageMessage('loading data...');
            event.preventDefault();
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_CUSTOMER + 'list';
            //const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + 'list';
            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(searchParams)
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

    const handleParamChange = (e) => {
        setSearchParams((prev) => ({
            ...prev, [e.target.id]: e.target.value
        }));
    };

    return (
        <div>
            <div className="row mb-2">
                <div className="col-3 text-start">
                    <ExportExcel excelData={users} fileName="list-customer" disabled={btnDisabled} />
                    <ExportCsv data={users} fileName="list-customer" disabled={btnDisabled} />
                </div>
                <div className="col-9 justify-content-end d-flex">
                    <div className="col-7">
                        <div className="input-group">
                            <div className="input-group-text">Filter</div>
                            <input type="text" id="nameEmail" className="form-control" placeholder="by name/email"  value={searchParams.nameEmail}  onChange={handleParamChange} />
                            <input type="number" id="loanAmount" className="form-control" placeholder="by loan amount" value={searchParams.loanAmount} onChange={handleParamChange} />
                            <input type="text" id="balance" className="form-control" placeholder="by balance" value={searchParams.balance} onChange={handleParamChange} />
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <div className="input-group-text">Status</div>
                            <select className="form-select" id="status" onChange={handleParamChange}>
                                <option selected>Choose...</option>
                                <option value="new">New</option>
                                <option value="outstanding">Outstanding</option>
                                <option value="complete">Complete</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleSearch} className="btn btn-success mx-2"> <i className="fa fa-search"></i>&nbsp; Show</button>
                </div>
            </div>
            <table className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Id</th>
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(users => (
                        <tr key={users.customerId}>
                            <td>{users.customerId}</td>
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
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={handleLookup(users)}>
                                    <i className="fa fa-external-link"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default Customer;
