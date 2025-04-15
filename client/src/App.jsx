import {Route, Routes} from "react-router-dom";
import AdminLogin from "../src/components/AdminLogin.jsx"

const App = () => {
    return(
        <Routes>
            <Route path="/" element={<AdminLogin/>}/>
        </Routes>
    )
}

export default App