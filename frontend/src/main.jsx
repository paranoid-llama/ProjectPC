import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Root from "./routes/root.jsx"
import Collections from "./routes/collections.jsx"
import ShowCollection from "./routes/showCollection.jsx"
import NewCollection from "./routes/newCollection.jsx"
import EditCollection from './routes/editcollection.jsx'
import ErrorPage from "./error-page";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"
import collectionLoader from './../utils/functions/collectionLoader.jsx'
import NavBar from "./components/partials/navbar"
import Footer from "./components/partials/footer"
import Box from "@mui/material/Box"
import listStyles from  "./../utils/styles/componentstyles/liststyles.jsx" 
import store from './app/store'
import {Provider} from 'react-redux'
import AlertsProvider from './alerts/alerts-context.jsx'
import { resizeEvent } from 'redux-window'
import TestList from './routes/testlist.jsx'

//can add a bit of debounce by adding number parameter in case the event causes performance issues
resizeEvent(store)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
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
  },
  {
    path: "/testlist",
    element: <TestList/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertsProvider>
      <Provider store={store}>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0}}>
          <NavBar />
          <RouterProvider router={router}/>
          <Footer />
        </Box>
      </Provider>
    </AlertsProvider>
  </React.StrictMode>
)
