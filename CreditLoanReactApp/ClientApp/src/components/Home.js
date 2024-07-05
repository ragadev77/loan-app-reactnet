import React, { Component } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        console.log('constructor');

        this.state = { tokenValue: '', userName : '', currentCount:0};
        this.incrementCounter = this.incrementCounter.bind(this);
        
    }
    componentDidMount() {
        console.log('init home');
        const tokenValue = sessionStorage.getItem('token');
        const userName = sessionStorage.getItem('userName');
        this.setState({tokenValue,userName});
    }
    
    incrementCounter() {
        this.setState({
            currentCount: this.state.currentCount + 1
        });
    }
    handleLogout() {
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('userName', '');
        window.location.href = '/login';
    }
    
    render() {
        const { tokenValue, userName } = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-11">
                        <h1 id="tabelLabel" >Welcome <span className="user-name">{userName}</span></h1>
                        <p>This App demonstrates credit loan simulation. 
                        Developed using Asp.Net Web API - React Js</p>
                    </div>
                    <div className="col-1 text-end">
                        <button className="btn btn-link" onClick={this.handleLogout} >Logout</button>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <label htmlFor="txtToken">Token</label>
                <textarea rows="3" className="form-control" name="txtToken" value={tokenValue} readOnly />

            </div>
        );

  }
}
