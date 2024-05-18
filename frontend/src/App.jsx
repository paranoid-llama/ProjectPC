import { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"
import Root from './routes/root'
import Collections from './routes/collections'
import Search from './routes/search'
import NewCollection from './routes/newCollection'
import ShowCollection from './routes/showCollection'
import EditCollection from './routes/editcollection'
import ErrorPage from "./error-page";
import NavBar from "./components/partials/navbar"
import Footer from "./components/partials/footer"
import Box from "@mui/material/Box"
import store from './app/store'
import { resizeEvent } from 'redux-window'
import listStyles from '../utils/styles/componentstyles/liststyles'
import collectionLoader from '../utils/functions/collectionLoader'
import './App.css'

//can add a bit of debounce by adding number parameter in case the event causes performance issues
resizeEvent(store)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/search",
    element: <Search />
  },
  {
    path: "/collections",
    element: <Collections />
  },
  {
    path: "/collections/new",
    element: <NewCollection />
  },
  {
    path: "/collections/:id",
    element: (
      <>
      
        <Outlet/>
        <ShowCollection listStyles={listStyles}/>
      
      </>
    ),
    loader: collectionLoader,
    children: [
      {
        path: 'edit',
        element: <EditCollection/>,
        loader: collectionLoader
      }
    ]
  }
])


function App() {

  return (
    <>
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0}}>
        <NavBar />
          <RouterProvider router={router}/>
        <Footer />
      </Box>
    </>
  )
}

export default App
