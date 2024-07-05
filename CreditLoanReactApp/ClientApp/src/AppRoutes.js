import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import Login from "./components//creditLoan/Login";
import TestModal from "./TestModal";
import { DbLoggerPage } from "./components/creditLoan/DbLoggerPage";
import LoanRequest from "./components/creditLoan/LoanRequest";
import Customer from "./components/creditLoan/Customer";
import Payment from "./components/creditLoan/Payment";
import ReportMonthly from "./components/creditLoan/ReportMonthly";
import CustomerList from "./components/creditLoan/CustomerList";
import LoanDetail from "./components/creditLoan/LoanDetail";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '/fetch-data',
        element: <FetchData />
    },
    {
     //   index: true,
        path: '/login',
        element: <Login />
    },
    {
        path: '/customer',
        element: <Customer />
    },
    {
        path: '/test-modal',
        element: <TestModal />
    },
    {
        path: '/loan-request',
        element: <LoanRequest />
    },
    {
        path: '/loan-detail',
        element: <LoanDetail />
    },
    {
        path: '/report-monthly',
        element: <ReportMonthly />
    },
    {
        path: '/payment',
        element: <Payment />
    },
    {
        path: '/customer-list',
        element: <CustomerList />
    },
    {
        path: '/dblogger',
        element: <DbLoggerPage />
    }

];

export default AppRoutes;
