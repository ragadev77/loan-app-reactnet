import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
function LoanRequest() {
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const initialHeader = {
        customerId:'',
        loanCode: '',
        plafond: '',
        tenor: '',
        interestRate: '',
        loanDate: ''
    };
    const [simHeader, setSimHeader] = useState(initialHeader);
    const [simDetails, setSimDetails] = useState([]);

    const [token, setToken] = useState('');

    /* modal variables */
    const [show, setShow] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const hideModal = () => {
        setShow(false);
    };
    /* end modal variables */


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
            <h3 id="tabelLabel" >Request Loan</h3>
            <p>This App demonstrates loan credit simulation.</p>
            <hr />
            <form>
                {showForm &&
                    <FormHeader simHeader={simHeader} setSimHeader={setSimHeader}
                        setSimDetails={setSimDetails} setPageMessage={setPageMessage}
                        setSelectedData={setSelectedData} setShow={setShow}
                    />
                }
            </form>
            {showForm &&
                <FormDetail simDetails={simDetails} />
                }
            {pageMessage && (
                <div className="alert alert-info text-center" role="alert">
                    {pageMessage}
                </div>
            )}
            <Dialog show={show} details={selectedData} handleClose={hideModal} />

        </div>
    );
}


const FormHeader = ({ simHeader, setSimHeader, setSimDetails, setPageMessage , setSelectedData, setShow}) => {
    
    const initialHeader = {
        customerId: '',
        loanCode: '',
        plafond: 0,
        tenor: '',
        interestRate: '',
        loanDate: ''
    };
    const [customers, setCustomers] = useState([]);    

    /*const handleChange = (e) => {
        setSimHeader((prev) => ({
            ...prev, [e.target.id]: e.target.value
        }));
    };*/

    const handleSimulate = async (event) => {
        //start validate
        if (simHeader.plafond === '') {
            event.preventDefault();
            setPageMessage('Mohon isi nilai plafond!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (simHeader.plafond > 50000000) {
            event.preventDefault();
            setPageMessage('Maximum plafond 50 jt!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (simHeader.cycle_month === '') {
            event.preventDefault();
            setPageMessage('Mohon isi lama pinjaman!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (simHeader.interest_rate === '') {
            event.preventDefault();
            setPageMessage('Mohon isi suku bunga!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (simHeader.installment_date === '') {
            event.preventDefault();
            setPageMessage('Mohon isi Tanggal Pinjam!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        //end validate        
        event.preventDefault();

        //start fetch
        console.log(simHeader);
        const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + "request";
        console.log(apiUrl);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': 'Bearer' + token
            },
            body: JSON.stringify(simHeader)
        });

        console.log(response.text);
        if (response.ok) {
            const data = await response.json();
            setSimDetails(data['data']);
            setPageMessage('Simulate success!');
            setTimeout(() => { setPageMessage('') }, 2000);
            //DbLogger('organizer_create_ok', 'CREATE', 'Success to create data from ' + apiUrl, '-', response.status);
        } else {
            const err = await response.json();
            setPageMessage(err['message']);
            //DbLogger('organizer_create_failed', 'CREATE', 'Failed to create data from ' + apiUrl, err['message'], err['status_code']);
            console.error(`HTTP error! status: ${response.status}...`);
            setPageMessage('Save failed!');
            setTimeout(() => { setPageMessage('') }, 2000);
        }

        //end fetch

    }

    const handleSearch = async (event) => {
        if (simHeader.customerId === '') {
            event.preventDefault();
            setPageMessage('Isi Customer Id');
            setTimeout(() => { setPageMessage('') }, 2000);
            return;
        }

        try {
            //start fetch
            event.preventDefault();
            console.log(simHeader.loan_code);
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + 'request/' + simHeader.customerId;
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
                if (data['data']['header'] != null) {
                    setSimHeader(data['data']['header']);
                    setSimDetails(data['data']['details']);
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

    const handleClear = () => {
        setSimHeader(initialHeader);
        setPageMessage('');
    }
    const handleShowDialog = selectedRec => {
        setSelectedData(selectedRec);
        setShow(true);
    };

    return (
    <div>
        <div className="row">
            <div className="col-9 border">
                <div className="form-group">
                    <label>Customer </label>
                    <input type="text" id="customerId" className="form-control"  placeholder="Please fill customer id"
                        value={simHeader.customerId} onChange={e => setSimHeader({ ...simHeader, customerId: e.target.value })} />
                </div>
            </div>
            <div className="col-3 mt-4 justify-content-end d-flex">
                    <button className="btn btn-secondary" onClick={() => handleShowDialog(customers)} title="show dialog"> <i className="fa fa-list"></i></button>
                <button className="btn btn-secondary" onClick={handleSearch} title="search data"> <i className="fa fa-search"></i></button>
                <button className="btn btn-primary mx-2" onClick={handleSimulate}> <i className="fa fa-save"></i>&nbsp;Request</button>
                <button className="btn btn-clear" onClick={handleClear} title="clear form"><i className="fa fa-eraser"></i></button>
            </div>
        </div >
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label>Plafond</label>
                    <input type="number" className="form-control" id="plafond" placeholder="Jumlah Pinjaman" title="Jumlah Pinjaman"
                        value={simHeader.plafond} onChange={e => setSimHeader({ ...simHeader, plafond: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Lama Pinjaman</label>
                    <input type="text" className="form-control" id="tenor" placeholder="Tenor [numeric]" title="Tenor"
                        value={simHeader.tenor} onChange={e => setSimHeader({ ...simHeader, tenor: e.target.value })} />
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label>Interest Rate</label>
                    <input type="number" className="form-control" id="interestRate" step="0.01" placeholder="Suku Bunga, i.e: 0.05 [decimal]"
                        value={simHeader.interestRate} onChange={e => setSimHeader({ ...simHeader, interestRate: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Loan Date</label>
                    <input type="date" className="form-control" id="loanDate" placeholder="Tanggal Mulai Angsuran [yyyy-mm-dd]"
                        value={simHeader.loanDate} onChange={e => setSimHeader({ ...simHeader, loanDate: e.target.value })} />
                </div>
            </div>
        </div>
    </div>

    );
}

const FormDetail = ({ simDetails }) => {
    const tableRef = useRef(null);

    return (
        <div>
            <hr/>
            <table className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Angs.Ke</th>
                        <th scope="col">Tanggal</th>
                        <th scope="col">Total Angsuran</th>
                        <th scope="col">Angsuran Pokok</th>
                        <th scope="col">Angsuran Bunga</th>
                        <th scope="col">Sisa Angsuran Pokok</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {simDetails.map(simDetails => (
                        <tr key={simDetails.id}>
                            <td width="10">{simDetails.rowNo}</td>
                            <td>{simDetails.dueDate.replace('T00:00:00', '')}</td>
                            <td>{simDetails.totalAmount.toLocaleString()}</td>
                            <td>{simDetails.mainAmount.toLocaleString()}</td>
                            <td>{simDetails.interestAmount.toLocaleString()}</td>
                            <td>{simDetails.remainingAmount.toLocaleString()}</td>
                            <td className="text-center" width="100">true</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

const Dialog = ({ show, handleClose, details }) => {

    const [users, setUsers] = useState([]);
    const [dialogMessage, setDialogMessage] = useState('');
    const handleList = async (event) => {

        try {
            //start fetch
            event.preventDefault();
            const page = 1;
            const pageSize = 10;
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
                    setDialogMessage(data.message);
                    setTimeout(() => { setDialogMessage('') }, 2000);
                }
                else {
                    setDialogMessage(data.message);
                    setTimeout(() => { setDialogMessage('') }, 2000);
                }
            } else {
                //const err = await response.json();
                console.error(`HTTP error! status: ${response.status}...`);
                setDialogMessage(data['message']);
                setTimeout(() => { setDialogMessage('') }, 2000);
            }

            //end fetch
        }
        catch (e) {
            console.log('dialog search error.....');
            setDialogMessage(e.message);
        }

    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    List Customer
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <button onClick={handleList} className="btn btn-success"> <i className="fa fa-search"></i>&nbsp; Show</button>

                <table class="table">
                    <thead>
                        <tr className="text-center">
                            <th scope="col">Cust Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Balance</th>
                            <th scope="col">loan Amount</th>
                            <th scope="col">Tenor</th>
                            <th scope="col">Outstanding</th>
                            <th scope="col">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(users => (
                            <tr key={users.customerId}>
                                <td width="80">{users.customerId}</td>
                                <td>{users.name}</td>
                                <td>{users.email}</td>
                                <td>{users.balance.toLocaleString()}</td>
                                <td>{users.loanAmount.toLocaleString()}</td>
                                <td>{users.tenor}</td>
                                <td>{users.outstanding.toLocaleString()}</td>
                                <td>{users.dueDate.replace('T00:00:00', '')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LoanRequest;
