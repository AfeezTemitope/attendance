// import LandingPage from "./pages/LandingPage.tsx";
import {RouterProvider} from "react-router-dom";
import routes from "./Routes.tsx";

const App =()=> {

    return(
        <RouterProvider router={routes} />
  // <LandingPage/>
  )
}

export default App


// import { RouterProvider, Routes } from 'react-router-dom';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import routes from './Routes.tsx';
// import './index.css'
//
// const App = () => {
//     return (
//         <RouterProvider router={routes}>
//             <TransitionGroup>
//                 <CSSTransition classNames="fade" timeout={300}>
//                     <Routes />
//                 </CSSTransition>
//             </TransitionGroup>
//         </RouterProvider>
//     );
// };
//
// export default App;