import {createBrowserRouter} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import AttendanceSheet from "./pages/AttendanceSheet.tsx"

const routes = createBrowserRouter ([
    {
        path:"/",
        element: <HomePage/>
    },
    {
        path:"landingPage",
        element:<LandingPage/>
    },
    {
        path:"/attendanceSheet",
        element:<AttendanceSheet/>
    }
])

export default routes