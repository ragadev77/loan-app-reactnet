import React, { useState, useRef, useEffect } from "react";
import './Dialog.css';

/*type ModalProps = {
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setLookupId: React.Dispatch<React.SetStateAction<string>>;
    setData: React.Dispatch<React.SetStateAction<Array>>;
};*/
function CustomerListDialog({ setShowDialog, data, setData }) {
    const [pageMessage, setPageMessage] = useState('');
    const [showForm, setShowForm] = useState(false);    
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const handleConfirm = () => {
        console.log(data);
        //setLookupId(selectedId);
        setData({ ...data, customerId: selectedId })
        setShowDialog(false);
    }


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setShowForm(true);
            const storedToken = token;
            if (storedToken) {
                setToken(storedToken);
            }
            loadList();
        }
        else {
            setShowForm(false);
            setPageMessage('Unauthorized, please login');
        }
    }, []);

    async function loadList() {

        try {
            //start fetch
            const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_CUSTOMER + 'list';
            const initSearchParams = { page: 1, pageSize: 10, nameEmail: '', loanAmount: 0, balance: 0, status: '' }            

            setPageMessage('Load data...');

            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': 'Bearer' + token
                    },
                    body: JSON.stringify(initSearchParams)
                });

            const data = await response.json();
            console.log('try sync data...');
            if (response.ok) {
                console.log(data);
                if (data['data'] != null) {
                    setUsers(data['data']);
                    setPageMessage('');
                }
                else {
                    setPageMessage(data.message);
                    setTimeout(() => { setPageMessage('') }, 2000);
                }
            } else {
                //const err = await response.json();
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage(data['message']);
                setTimeout(() => { setPageMessage('') }, 2000);
            }

            //end fetch
        }
        catch (e) {
            console.log('page error.....');
            setPageMessage(e.message);
        }

    }

    return (
        <div onClick={(e) => e.stopPropagation()}>

            <div className="div-center">
                <button className="close-icon" onClick={() => setShowDialog(false)} > <i className="fa fa-close"></i></button>
                <h3 id="tabelLabel" >Customer Dialog</h3>
                <hr />
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Selected id</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Selected Id" aria-label="Username" aria-describedby="basic-addon1"
                        value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button"
                            onClick={handleConfirm}>Confirm
                        </button>
                    </div>
                </div>
                {showForm &&
                    <FormDetail 
                    users={users} setUsers={setUsers}
                    pageMessage={pageMessage} setPageMessage={setPageMessage}
                    selectedId={selectedId} setSelectedId={setSelectedId}
                    />
                }
                {pageMessage && (
                    <div className="alert alert-info text-center" role="alert">
                        {pageMessage}
                    </div>
                )}
            </div>

        </div>
    );
}

const FormDetail = ({ users, setUsers, setPageMessage, setSelectedId}) => {
    const tableRef = useRef(null);
    const [page, setpage] = useState(1);
    const [pageSize, setpageSize] = useState(10);
    const [searchId, setSearchId] = useState('');

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

    const handleSelect =  (selectedRec) => {
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>            
            <table className="table table-striped table-hover table-bordered" ref={tableRef}>
                <thead>
                    <tr className="text-center">
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(users => (
                        <tr key={users.customerId} onClick={() => setSelectedId(users.customerId)} >
                            <td>{users.customerId}</td>
                            <td>{users.name}</td>
                            <td>{users.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default CustomerListDialog;
