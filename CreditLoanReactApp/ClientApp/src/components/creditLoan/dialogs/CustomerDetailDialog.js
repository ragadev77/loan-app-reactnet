import React, { useState, useRef, useEffect } from "react";
import "./CustomerDetailDialog.css";

function CustomerDetailDialog({ setShowDialog, selectedRec, setSelectedRec }) {    
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    /*const initCustomer = {
        customerId:'',
        balance: '',
        loanAmount: '',
        outstanding: '',
        tenor: '',
        interestRate: '',
        loanDate: '',
        dueDate: ''
    };*/
    const [customer, setCustomer] = useState({});
    const [details, setDetails] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(true);

    const [token, setToken] = useState('');

    const fetchItems = async () => {
        const url = process.env.REACT_APP_URL_CREDITLOAN + 'search/' + selectedRec;;
        const data = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const items = await data.json();
        console.log(items);
        setCustomer(items['data']['customer']);
        setDetails(items['data']['details']);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setShowForm(true);
            const storedToken = token;
            if (storedToken) {
                setToken(storedToken);
            }
            fetchItems();
        }
        else {
            setShowForm(false);
            setPageMessage('Unauthorized, please login');
        }
    }, []);    

    const handleClose = () => {
        setShowDialog(false);
    }    

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <div className="div-center-custloandialog">                
                <button className="close-icon-custloandialog" onClick={handleClose} > <i className="fa fa-close"></i></button>
                <h3>Loan Detail</h3>
                <p>This Page display customer loan detail.</p>
                <hr />
                <form>
                    {showForm &&
                        <FormHeader customer={customer} details={details} btnDisabled={setBtnDisabled}
                        />
                    }
                </form>
                {pageMessage && (
                    <div className="alert alert-info text-center" role="alert">
                        {pageMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

const FormHeader = ({ customer, details, btnDisabled }) => {
    const tableRef = useRef(null);

    return (
        <div>
            <div className="row" >
                <div className="col">
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Cust Id</div>
                        <input type="text" className="form-control" value={customer.customerId} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Name</div>
                        <input type="text" className="form-control" value={customer.name} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Loan Amount</div>
                        <input type="text" className="form-control" value={customer.loanAmount?.toLocaleString()} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Balance</div>
                        <input type="text" className="form-control" value={customer.balance?.toLocaleString()} readOnly />
                    </div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Outstanding</div>
                        <input type="text" className="form-control" value={customer.outstanding?.toLocaleString()} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Tenor</div>
                        <input type="text" className="form-control" value={customer.tenor} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Due Date</div>
                        <input type="text" className="form-control" value={customer.dueDate?.replace('T00:00:00', '')} readOnly />
                    </div>
                    <div className="input-group">
                        <div className="input-group-text prep-fix">Interest Rate</div>
                        <input type="text" className="form-control" value={customer.interestRate?.toLocaleString()} readOnly />
                    </div>

                </div>
            </div>
            <br/>
            <table id="detailData" className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">No</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Total Amount</th>
                        <th scope="col">Main Amount</th>
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

export default CustomerDetailDialog;
