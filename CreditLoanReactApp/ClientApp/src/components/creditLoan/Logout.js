import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Logout() {

    const navigate = useNavigate();
    sessionStorage.setItem('token', '');
    navigate('/login');
}
export default Logout;
