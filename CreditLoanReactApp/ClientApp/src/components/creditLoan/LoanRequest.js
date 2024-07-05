import React, { useState, useRef, useEffect } from "react";
import ExportCsv from './ExportCsv';
import ExportExcel from "./ExportExcel";
import CustomerListDialog from "./CustomerListDialog";

function LoanRequest() {
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
    const [header, setHeader] = useState(initialHeader);
    const [details, setDetails] = useState([]);

    const [token, setToken] = useState('');

    const [showDialog, setShowDialog] = useState(false);
    const [lookupId, setLookupId] = useState('');


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
            <h3 id="tabelLabel" >LOAN REQUEST</h3>
            <p>This is a page to create new Loan request</p>
            <hr />
            {showForm && <FormHeader header={header} setHeader={setHeader}
                setDetails={setDetails} setPageMessage={setPageMessage} initialHeader={initialHeader}
                setShowDialog={setShowDialog} 
            />
            }
            <hr />
            {showForm &&
                <FormDetail
                    details={details} setDetails={setDetails}
                    pageMessage={pageMessage} setPageMessage={setPageMessage}
                    btnDisabled={btnDisabled} setBtnDisabled={setBtnDisabled}/>
            }
            {pageMessage && (
                <div className="alert alert-info text-center" role="alert">
                    {pageMessage}
                </div>
            )}
            {showDialog && (<CustomerListDialog setShowDialog={setShowDialog} setData={setHeader} />)}

        </div>
    );
}


const FormHeader = ({ header, setHeader, setDetails, setPageMessage, initialHeader, setShowDialog }) => {
   
    const handleSimulate = async (event) => {
        //start validate
        if (header.loanAmount === '') {
            event.preventDefault();
            setPageMessage('Mohon isi nilai plafond!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (header.loanAmount > 50000000) {
            event.preventDefault();
            setPageMessage('Maximum plafond 50 jt!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (header.tenor === '') {
            event.preventDefault();
            setPageMessage('Mohon isi lama pinjaman!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (header.interestRate === '') {
            event.preventDefault();
            setPageMessage('Mohon isi suku bunga!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        if (header.loanDate === '') {
            event.preventDefault();
            setPageMessage('Mohon isi Tanggal Pinjam!');
            setTimeout(() => { setPageMessage('') }, 1500);
            return;
        }
        //end validate        
        event.preventDefault();

        console.log(header);

        //start fetch
        const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + "request";
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(header)
            });

        const data = await response.json();
        if (response.ok) {
            setHeader(data['data']['customer']);
            setDetails(data['data']['details']);
            setPageMessage('Loan request saved!');
            setTimeout(() => { setPageMessage('') }, 2000);
        } else {
            setPageMessage('Loan request saved!');
            console.error(`HTTP error! status: ${response.status}...`);
            setPageMessage('Save failed! ' + data['message']);
            setTimeout(() => { setPageMessage('') }, 2000);
        }

        //end fetch

    }

    const handleSearch = async (event) => {
        if (header.customerId === '') {
            event.preventDefault();
            setPageMessage('Isi Customer Id');
            setTimeout(() => { setPageMessage('') }, 2000);
            return;
        }

        try {
            //start fetch
            event.preventDefault();
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + 'request/' + header.customerId;
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
                if (data['data']['customer'] != null) {
                    setHeader(data['data']['customer']);
                    setDetails(data['data']['details']);
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

    const handleClear = (event) => {
        setHeader(initialHeader);
        setPageMessage('');
    }
    const handleLookup = (event) => {
        event.preventDefault();
        setShowDialog(true);
    };

    return (
        <div>

        <form>
            <div class="input-group mb-2">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Customer id </span>
                </div>
                <input type="text" class="form-control" id="customerId" placeholder="Select Customer Id" aria-label="CustomerId" aria-describedby="basic-addon1"
                    value={header.customerId}  />
                <div class="input-group-append">
                    <button class="btn btn-secondary" type="button" onClick={handleLookup}><i className="fa fa-search mx-1"></i>Lookup</button>
                    {/*                <button className="btn btn-secondary" onClick={handleSearch} title="search data"> <i className="fa fa-search"></i>Search</button>*/}
                    <button className="btn btn-primary mx-1" onClick={handleSimulate}> <i className="fa fa-save"></i>&nbsp;Request</button>
                    <button className="btn btn-clear" onClick={handleClear} title="clear form"><i className="fa fa-eraser"></i></button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Loan Amount</span>
                        </div>
                        <input type="number" className="form-control" id="loanAmount" placeholder="Jumlah Pinjaman" title="Jumlah Pinjaman"
                            value={header.loanAmount} onChange={e => setHeader({ ...header, loanAmount: e.target.value })} />
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Tenor</span>
                        </div>
                        <input type="number" className="form-control" id="tenor" placeholder="Lama Pinjaman" title="Tenor" min="1" max="48"
                            value={header.tenor} onChange={e => setHeader({ ...header, tenor: e.target.value })} />
                    </div>

                </div>
                <div className="col">

                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Interest Rate</span>
                        </div>
                        <input type="number" className="form-control" id="interestRate" placeholder="Interest Rate" title="Interest Rate"
                            value={header.interestRate} onChange={e => setHeader({ ...header, interestRate: e.target.value })} />
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Loan Date</span>
                        </div>
                        <input type="date" className="form-control" id="loanDate" placeholder="[yyyy-mm-dd]"
                            value={header.loanDate} onChange={e => setHeader({ ...header, loanDate: e.target.value })} />
                    </div>

                </div>
            </div>
            </form>
        </div>
    );
}



const FormDetail = ({ details }) => {
    const tableRef = useRef(null);

    return (
        <div>
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
                    {details.map(details => (
                        <tr key={details.id}>
                            <td width="10">{details.rowNo}</td>
                            <td>{details.dueDate.replace('T00:00:00', '')}</td>
                            <td>{details.totalAmount.toLocaleString()}</td>
                            <td>{details.mainAmount.toLocaleString()}</td>
                            <td>{details.interestAmount.toLocaleString()}</td>
                            <td>{details.remainingAmount.toLocaleString()}</td>
                            <td className="text-center" width="100">{ details.paymentStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default LoanRequest;
