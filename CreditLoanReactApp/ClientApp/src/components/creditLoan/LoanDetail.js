import React, { useState, useRef, useEffect } from "react";
import ExportCsv from './ExportCsv';
import ExportExcel from "./ExportExcel";
import CustomerListDialog from "./CustomerListDialog";

function LoanDetail() {
    const [show, setShow] = useState(false);
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const initCustomer = {
        customerId:'',
        balance: '',
        loanAmount: '',
        outstanding: '',
        tenor: '',
        interestRate: '',
        loanDate: '',
        dueDate: ''
    };
    const [customer, setCustomer] = useState(initCustomer);
    const [details, setDetails] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(true);

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
            <h3 id="tabelLabel" >Loan Detail</h3>
            <p>This Page display customer loan detail.</p>
            <hr />
            <form>
                {showForm &&
                    <FormHeader customer={customer} setCustomer={setCustomer} setDetails={setDetails}
                        setPageMessage={setPageMessage} setBtnDisabled={setBtnDisabled} setShowDialog={setShowDialog}
                    />
                }
            </form>
            {showForm &&
                <FormDetail details={details} btnDisabled={btnDisabled}
                />
                }
            {pageMessage && (
                <div className="alert alert-info text-center" role="alert">
                    {pageMessage}
                </div>
            )}
            {showDialog && (<CustomerListDialog setShowDialog={setShowDialog} setLookupId={setLookupId} setData={setCustomer} />)}

        </div>
    );
}


const FormHeader = ({ customer, setCustomer, setDetails, setPageMessage, setBtnDisabled, setShowDialog }) => {

    const initCustomer = {
        customerId: '', name: '', balance: '0', loanAmount: '0', outstanding: '0'
        , tenor: '0', dueDate: '', interestRate: '0'
    };

    const handleSearch = async (event) => {
        if (customer.customerId === '') {
            event.preventDefault();
            setPageMessage('Isi Customer Id');
            setTimeout(() => { setPageMessage('') }, 2000);
            return;
        }

        try {
            //start fetch
            event.preventDefault();

            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + 'report/' + customer.customerId;
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
                if (data['data'] != null) {
                    setCustomer(data['data']['customer']);
                    setDetails(data['data']['details']);
                    setPageMessage(data.message);
                    setBtnDisabled(false);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
                else {
                    console.log('...asdasd');
                    setPageMessage(data.message);
                    setBtnDisabled(true);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
            } else {
                //const err = await response.json();
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage('No Data Found!');
                setCustomer(initCustomer);
                setDetails([]);
                setBtnDisabled(true);
                setTimeout(() => { setPageMessage('') }, 3000);
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
        setCustomer(initCustomer);
        setPageMessage('');
    }

    const handleLookup = (event) => {
        event.preventDefault();
        setDetails([]);
        setShowDialog(true);
    };


    return (
        <div>
            <div className="row" >
                <div className="col">
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Id</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-10 px-2">
                                    <input type="text" class="form-control" id="customerId" placeholder="Select Customer Id" aria-label="CustomerId" aria-describedby="basic-addon1"
                                        value={customer.customerId} />
                                </div>
                                <div className="col-2 justify-content-end d-flex">
                                    <button className="btn btn-secondary" onClick={handleLookup} title="Lookup Customer"> <i className="fa fa-search"></i></button>
                                    <button className="btn btn-primary" onClick={handleSearch} title="Search data"> <i className="fa fa-play"></i></button>
                                    {/*<button className="btn btn-clear" onClick={handleClear} title="clear form"><i className="fa fa-eraser"></i></button>*/}
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Name</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.name}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Loan Amount</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.loanAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Balance</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.balance?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="col">

                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Outstanding</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.outstanding?.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Tenor</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.tenor}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Due Date</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.dueDate?.replace('T00:00:00','')}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="span-label">Interest Rate</span>
                        </div>
                        <div className="col-1">:</div>
                        <div className="col-6 justify-content-start d-flex">
                            <span className="span-value">{customer.interestRate?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

const FormDetail = ({ details, btnDisabled}) => {
    const tableRef = useRef(null);

    const exportPdfId = '#detailData';
    
return (
    <div>
        <div className="row">
            <div className="col text-end">
                <ExportCsv data={details} fileName="cust_loan_detail" disabled={btnDisabled} />
                <ExportExcel excelData={details} fileName="cust_loan_detail" disabled={btnDisabled} />
            </div>
        </div>
            <table id="detailData" className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Pay No</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Total Pay Amount</th>
                        <th scope="col">Pay Amount</th>
                        <th scope="col">Interest Amount</th>
                        <th scope="col">Remaining Amount</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(details => (
                        <tr key={details.id}>
                            <td>{details.rowNo}</td>
                            <td>{details.dueDate.replace('T00:00:00', '')}</td>
                            <td>{details.totalAmount.toLocaleString()}</td>
                            <td>{details.mainAmount.toLocaleString()}</td>
                            <td>{details.interestAmount.toLocaleString()}</td>
                            <td>{details.remainingAmount.toLocaleString()}</td>
                            <td className="text-center" width="100">{details.paymentStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default LoanDetail;
