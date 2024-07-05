import React, { useState, useRef, useEffect } from "react";
import { useDownloadExcel } from "react-export-table-to-excel"
import ExportCsv from './ExportCsv';
import ExportExcel from "./ExportExcel";

function Payment() {
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
            <h3 id="tabelLabel" >Payment</h3>
            <p>This page synchronize customer payment data from csv file on ftp server.</p>
            <hr />
            {showForm &&
                <FormDetail 
                    details={details} setDetails={setDetails} setPageMessage={setPageMessage}
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

    const handleSync = async (event) => {
        try {
            //start fetch
            event.preventDefault();
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN + 'payment';
            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'POST',
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


    return (
        <div>
            <div className="row">
                <div className="col-8">
                    <ExportCsv data={details} fileName="creditloan_report" disabled={btnDisabled} />
                    <ExportExcel excelData={details} fileName="creditloan_report" disabled={btnDisabled} />
                </div>
                <div className="col-4 justify-content-end d-flex">
                    <button onClick={handleSync} className="btn btn-success"> <i className="fa fa-arrow-circle-down"></i>&nbsp; Start Sync</button>
                </div>
            </div>
            <table className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Payment Id</th>
                        <th scope="col">Customer Id</th>
                        <th scope="col">Payment Date</th>
                        <th scope="col">Payment Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(details => (
                        <tr key={details.id}>
                            <td>{details.paymentId}</td>
                            <td>{details.customerId}</td>
                            <td>{details.paymentDate.replace('T00:00:00', '')}</td>
                            <td>{details.paymentAmount.toLocaleString()}</td>
                            <td>{details.status}</td>
                            <td>{details.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};


export default Payment;
