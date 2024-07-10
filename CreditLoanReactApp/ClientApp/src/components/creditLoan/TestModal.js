import React, { useState } from "react";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const data = [
    {
        id: 1001,
        firstname: "Mark",
        lastname: "Otto",
        age: 34,
        location: "London",
        address: "10 Downing Street"
    },
    {
        id: 1002,
        firstname: "Jacob",
        lastname: "Snow",
        age: 34,
        location: "India",
        address: "#110 broad Street"
    },
    {
        id: 1003,
        firstname: "Sarun",
        lastname: "U K",
        age: 30,
        location: "USA",
        address: "#1 NY"
    }
];

function TestModal() {
    const [show, setShow] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const handleClick = (selectedRec) => {
        setSelectedData(selectedRec);
        setShow(true);
    };

    const hideModal = () => {
        setShow(false);
    };

    return (
        <div className="App">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Location</th>
                        <th scope="col">Show More</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((v) => (
                        <tr>
                            <td>{v.id}</td>
                            <td>{v.firstname}</td>
                            <td>{v.lastname}</td>
                            <td>@{v.location}</td>
                            <td>
                                <Button variant="link" onClick={() => handleClick(v)}>Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dialog show={show} details={selectedData} handleClose={hideModal} />
        </div>
    );
}

const Dialog = ({ show, handleClose, details }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {details?.firstname} {details?.lastname}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Age</th>
                            <th scope="col">Location</th>
                            <th scope="col">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{details?.id}</td>
                            <td>{details?.firstname}</td>
                            <td>{details?.lastname}</td>
                            <td>{details?.age}</td>
                            <td>{details?.location}</td>
                            <td>{details?.address}</td>
                        </tr>
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

export default TestModal;
