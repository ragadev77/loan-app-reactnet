import React, { useState, useRef, useEffect } from "react";
import ExportCsv from './exports/ExportCsv';
import ExportExcel from "./exports/ExportExcel";

function ReportMonthly() {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);    
    const [details, setDetails] = useState([]);

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
            <h3 id="tabelLabel" >Report Monthly</h3>
            <p>This Page display payment report by month.</p>
            <hr />
            {showForm &&
                <FormDetail 
                details={details} setDetails={setDetails}
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



const FormDetail = ({ details, setDetails, setPageMessage, btnDisabled, setBtnDisabled }) => {
    const tableRef = useRef(null);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2024);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleSync = async (event) => {

        try {
            //start fetch
            event.preventDefault();
            console.log(month);
            console.log(year);
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN +
                            'report?month=' + month + '&year=' + year +
                            '&page=' + page + '&pageSize=' + pageSize;
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
                    console.log(data['data']);
                    setDetails(data['data']);
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
            //setPageMessage('An error occurred while processing');
            setPageMessage(e.message);
        }

    }

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        setDetails([]);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
        setDetails([]);
    };

    const handlePageChange = (event) => {
        setPage(event.target.value);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
    };

    return (
        <div>
            <div className="row">
                <div className="col-3">
                    <ExportExcel excelData={details} fileName="creditloan_report" disabled={btnDisabled} />
                    <ExportCsv data={details} fileName="creditloan_report" disabled={btnDisabled} />
                </div>
                <div className="col-9 justify-content-end d-flex">
                    <div className="col-8">
                        <div className="input-group">
                            <div className="input-group-text">Page</div>
                            <input type="number" id="page" className="form-control" defaultValue="0" value={page} onChange={handlePageChange} />
                            <div className="input-group-text">PageSize</div>
                            <input type="number" id="pageSize" className="form-control" defaultValue="0" value={pageSize} onChange={handlePageSizeChange} />
                            <div className="input-group-text">Month</div>
                            <input type="number" className="form-control" min="1" max="12" placeholder="input month" value={month} onChange={handleMonthChange} required />
                            <div className="input-group-text">Year</div>
                            <input type="number" className="form-control" min="2020" max="2025" placeholder="input year" value={year} onChange={handleYearChange} required />
                        </div>
                    </div>
                    <button onClick={handleSync} className="btn btn-success mx-2"> <i className="fa fa-search"></i>&nbsp; Show</button>
                </div>
            </div>            
            <table className="table table-striped table-hover table-bordered my-2" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">CstId</th>
                        <th scope="col">Loan Amt</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Outstanding</th>

                        <th scope="col">Seq</th>
                        <th scope="col">DueDate</th>
                        <th scope="col">Total Amt</th>
                        <th scope="col">Main Amt</th>
                        <th scope="col">Int Amt</th>
                        <th scope="col">Rem Amt</th>

                        <th scope="col">PayId</th>
                        <th scope="col">PayDate</th>
                        <th scope="col">PayStatus</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(details => (
                        <tr key={details.rowId}>
                            <td width="2%">{details.customerId}</td>
                            <td>{details.loanAmount.toLocaleString()}</td>
                            <td>{details.balance.toLocaleString()}</td>
                            <td>{details.outstanding.toLocaleString()}</td>

                            <td>{details.rowNo}</td>
                            <td>{details.dueDate.replace('T00:00:00', '')}</td>
                            <td>{details.totalAmount.toLocaleString()}</td>
                            <td>{details.mainAmount.toLocaleString()}</td>
                            <td>{details.interestAmount.toLocaleString()}</td>
                            <td>{details.remainingAmount.toLocaleString()}</td>

                            <td>{details.paymentId}</td>
                            <td>{details.paymentDate.replace('T00:00:00', '')}</td>
                            <td>{details.paymentStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default ReportMonthly;
