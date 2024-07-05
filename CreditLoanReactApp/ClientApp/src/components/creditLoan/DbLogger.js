import React, { Component, useState } from 'react';

export async function DbLogger(logName, logCategory, logMessage, logError, logCode) {

    const apiLogger = process.env.REACT_APP_URL_CREDITLOAN_LOG;         

    const log_response = await fetch(apiLogger, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            log_name: logName,
            log_category: logCategory,
            log_message: logMessage,
            log_error: logError,
            log_code: logCode
        })
    });
    if (log_response.ok)
        console.log('Logged succesfully');
    else
        console.error(`Logger error! status: ${log_response.status}`);

  
}
