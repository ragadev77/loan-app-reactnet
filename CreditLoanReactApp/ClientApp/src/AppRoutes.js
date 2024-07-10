import { Home } from "./components/Home";
import Login from "./components//creditLoan/Login";
//import { DbLoggerPage } from "./components/creditLoan/DbLoggerPage";
import LoanRequest from "./components/creditLoan/LoanRequest";
import User from "./components/creditLoan/User";
import Payment from "./components/creditLoan/Payment";
import ReportMonthly from "./components/creditLoan/ReportMonthly";
import Customer from "./components/creditLoan/Customer";
import LoanDetail from "./components/creditLoan/LoanDetail";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
     //   index: true,
        path: '/login',
        element: <Login />
    },
    {
        path: '/user',
        element: <User />
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
        path: '/customer',
        element: <Customer />
    }

];

export default AppRoutes;
