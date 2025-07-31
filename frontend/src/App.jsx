  
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/shared/Navbar.jsx'  // ✅ correct path
import Login from './components/ui/auth/Login.jsx'
import SignUp from './components/ui/auth/SignUp.jsx'
import Home from './components/ui/Home.jsx'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  }
])

function App() {
  return (
    <>
      <RouterProvider router = {appRouter}/>
    </>
  )
}

export default App


