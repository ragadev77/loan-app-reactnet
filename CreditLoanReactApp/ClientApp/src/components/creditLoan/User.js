import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
//import { DbLogger } from './DbLogger';

function User() {
    const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_CUSTOMER;    
    const [searchId, setSearchId] = useState('');
    const initialFormState = {
        customerId: '',
        name: '',
        email: '',
        phoneNumber:'',
        address: '',
        password: '',
        repeatPassword:''
    };
    const [user, setUser] = useState(initialFormState);
    const [token, setToken] = useState('');
    const [pageMessage, setPageMessage] = useState('');
    const [upsertButton, setUpsertButton] = useState('Save');
    const [upsertDisable, setUpsertDisable] = useState(true);
    const [delDisable, setDelDisable] = useState(true);
    const [showFormPassword, setShowFormPassword] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(true);
    const [errorResponses, setErrorResponses] = useState([]);
    const navigate = useNavigate();

    const handleshowFormPassword = () => {
        setShowFormPassword(true);
    };  

    const handleSearchIdChange = (event) => {
        setPageMessage('');
        setShowFormPassword(false);
        setSearchId(event.target.value);
        setUser(initialFormState);
    };

    const handleSearch = async (event) => {
        setUser(initialFormState);

        try {
            if (searchId === 0 || searchId == null || searchId === '') {
                setPageMessage('Id required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }

            setPageMessage('Searching...');
            const response = await fetch(apiUrl + searchId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                }
            });

            console.log('fetch done...');
            if (response.ok) {

                console.log('try get data...');

                const data = await response.json();
                console.log(data);
                setPageMessage('Data Found!');
                setUser({
                    name: data['data']['name'],
                    email: data['data']['email'],
                    phoneNumber: data['data']['phoneNumber'],
                    address: data['data']['address'],
                });
                setUpsertButton('Update');
                setUpsertDisable(false);
                setDelDisable(false);
                setTimeout(() => { setPageMessage('') }, 2000);
                setShowFormUpdate(true);
                setShowFormPassword(false);
            } else {
                setPageMessage('No Data Found!');
                setUpsertDisable(true);
                setDelDisable(true);
                setTimeout(() => { setPageMessage('') }, 2000);
            }
        } catch (e) {
            console.log('page error...');
            setPageMessage('An error occurred while searching');
        }
    };

    const handleUpsert = async (event) => {
        //event.preventDefault();
        if (searchId === 0 || searchId == null || searchId ==='') {
            console.log('try create..')
            handleCreate(event);
        } else {
            console.log('try update..' + searchId)
            console.log(user);
            handleUpdate(event);
        }
    };

    const handleCreate = async (event) => {
        //const token = sessionStorage.getItem('token');
        //setPageMessage('');
        console.log(user);
        try {

            if (user.name === '') {                
                setPageMessage('Name Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            } 
            if (user.email === '') {
                setPageMessage('Email Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }
            if (user.phoneNumber === '') {
                setPageMessage('Phone Number Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }
            if (user.address === '') {
                setPageMessage('Address Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }
            if (user.password === '') {
                setPageMessage('Password Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }
            if (user.repeatPassword === '') {
                setPageMessage('Repeat Password Required');
                setTimeout(() => { setPageMessage('') }, 1500);
                return;
            }
            if (user.repeatPassword !== '' && user.password !== '') {
                if (user.repeatPassword !== user.password) {
                    setPageMessage('Repeat Password must be match with Password');
                    setTimeout(() => { setPageMessage('') }, 1500);
                    return;
                }
            }

            event.preventDefault();
            setPageMessage('Saving data...');

            console.log(user);
            console.log('validated, try save...');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(user)
            });
            console.log(apiUrl);

            const result = await response.json();   
            if (response.ok) {
                console.log(result);
                setPageMessage(`Create success, redirecting to login page`);
                setUpsertDisable(true);
                setUser(initialFormState);
                setShowFormPassword(false);
                setDelDisable(true);
                setTimeout(() => { navigate('/login') }, 2000);
                
                //DbLogger('user_create_success', 'CREATE', 'Create data from ' + apiUrl + ' success', '-', response.status);

            } else {
                setErrorResponses(result);
                console.log(result);
                //DbLogger('user_create_failed', 'CREATE', 'Create data from ' + apiUrl + ' failed', logResult['message'], logResult['status_code']);
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage('Save failed ' + result.message);
            }
            

        } catch (e) {
            console.log('page error.....');
            setPageMessage('An error occurred while processing');
        }
    };

    const handleUpdate = async (event) => {
        //const token = sessionStorage.getItem('token');

        setPageMessage('Start Update...');
        console.log('start update..');
        try {

            if (user.name === '') {
                setPageMessage('Name Required');
                return;
            }
            if (user.email === '') {
                setPageMessage('Email Required');
                return;
            }
            if (user.phoneNumber === '') {
                setPageMessage('Phone Number Required');
                return;
            }
            if (user.address === '') {
                setPageMessage('Address Required');
                return;
            }

            event.preventDefault();
            console.log(user);
            setPageMessage('Updating data...');
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(user)
            });

            console.log('update done...');
            if (response.ok) {
                setPageMessage('Update success!');
                setTimeout(() => { setPageMessage('') }, 2000);
                //DbLogger('user_update_success', 'UPDATE', 'Update data from ' + apiUrl + ' success','-', response.status);
            } else {
                const log = await response.json();
                setErrorResponses(log);
                //DbLogger('user_update_failed', 'UPDATE', 'Update data from ' + apiUrl + ' failed', log['message'], log['status_code']);
                //console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage('Update failed!');
            }
        } catch (e) {
            console.log('page error.....');
            setPageMessage('An error occurred while processing');
        }
    };

    const handleDelete = async (event) => {
        const token = sessionStorage.getItem('token');

        setPageMessage('Removing data...');
        try {

            const response = await fetch(apiUrl + searchId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(user)
            });

            console.log('delete done...');
            if (response.ok) {
                setPageMessage('Deleted!');
                setDelDisable(true);
                setTimeout(() => { handleClear() }, 2000);
                //DbLogger('user_delete_success', 'DELETE', 'Delete data from ' + apiUrl + searchId + ' success', '-');
            } else {
                //DbLogger('user_delete_failed', 'DELETE', 'Delete data from ' + apiUrl + searchId + ' failed', response.statusText);
                console.error(`HTTP error! status: ${response.status}...`);
                setPageMessage('Delete failed!');
                setTimeout(() => { setPageMessage('') }, 1500);
}
        } catch (e) {
            console.log('page error.....');
            setPageMessage('An error occurred while processing');
        }
    }
    const handleAdd = async (event) => {
        setSearchId('');
        setUser(initialFormState);
        setUpsertButton('Save');
        setUpsertDisable(false);
        setDelDisable(true);
        setShowFormUpdate(true);
        handleshowFormPassword();
    }
    const handleClear = async (event) => {
        setSearchId('');
        setUser(initialFormState);
        setUpsertButton('Save');
        setUpsertDisable(true);
        setDelDisable(true);
        setShowFormPassword(false);
        setShowFormUpdate(false);
        setPageMessage('');
    }

    return (
        <div>
            <div className="div-center">
                <div className="content">
                    <h3>Customer</h3>
                    <p>Customer CRUD Page</p>
                    <hr />
                    <div className="input-group mb-2">
                        <input type="number" className="form-control" placeholder="Search by Id" required
                            value={searchId} onChange={handleSearchIdChange} />
                        <div className="input-group-prepend">
                            <button type="button" className="btn btn-secondary flex-grow-1" onClick={handleSearch}><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                    <form>
                        {showFormUpdate &&
                            <FormUpdate user={user} setUser={setUser} show={showFormUpdate} setShow={setShowFormUpdate} />
                        }
                        {showFormPassword &&
                            <FormCreate user={user} setUser={setUser} show={showFormPassword} setShow={setShowFormPassword} />                                 
                        }
                        <hr/>
                        <div className="row">
                            <div className="col-8">
                                <button type="submit" className="btn btn-primary"
                                    onClick={handleUpsert} disabled={upsertDisable}><i className="fa fa-save"></i>&nbsp; {upsertButton}
                                </button>                       
                                <button type="button" className="btn btn-link"
                                    onClick={handleClear}> Clear Form
                                </button>                       
                            </div>
                            <div className="col-4 text-end">
                                <button type="button" className="btn btn-success" 
                                    onClick={handleAdd} title="Add new User" ><i className="fa fa-plus">&nbsp;New</i>
                                </button>
                                <span>&nbsp;</span>
                                <button type="button" className="btn btn-danger"
                                    onClick={handleDelete} title="Delete User" disabled={delDisable} ><i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>                        
                    </form>
                    {pageMessage && (
                        <div className="alert alert-info mt-3 text-center" role="alert">
                            {pageMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
const FormUpdate = ({ user, setUser }) => {
    const handleChange = (e) => {
        setUser((prev) => ({
            ...prev, [e.target.id]:e.target.value
        }));
    };
    return (
        <div>
            <div className="div-content">          

                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Name</span>
                    </div>
                    <input id="name" type="text" className="form-control" placeholder="Name" required
                        value={user.name} onChange={handleChange} />
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Email</span>
                    </div>
                    <input id="email" type="email" className="form-control" placeholder="Email" required
                        value={user.email} onChange={handleChange} />
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Phone No</span>
                    </div>
                    <input id="phoneNumber" type="text" className="form-control" placeholder="Phone Number" required
                        value={user.phoneNumber} onChange={handleChange} />
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Address</span>
                    </div>
                    <input id="address" type="text" className="form-control" placeholder="Address" required
                        value={user.address} onChange={handleChange} />
                </div>

            </div>
        </div>
    );
}
const FormCreate = ({ user, setUser, show, setShow }) => {
    const handleChange = (e) => {
        setUser((prev) => ({
            ...prev, [e.target.id]: e.target.value
        }));
    };
    return (
        <div>
            <div className="div-content">
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Password</span>
                    </div>
                    <input id="password" type="password" className="form-control" placeholder="Password" required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        value={user.password} onChange={handleChange} />
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Repeat Password</span>
                    </div>
                    <input id="repeatPassword" type="password" className="form-control" placeholder="Repeat Password" required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        value={user.repeatPassword} onChange={handleChange} />
                </div>
            </div>
        </div>
    );
}


export default User;