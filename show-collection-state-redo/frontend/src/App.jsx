import { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useLocation
} from "react-router-dom"
import Root from './routes/root'
import Collections from './routes/collections'
import Search from './routes/search'
import NewCollection from './routes/newCollection'
import ShowCollection from './routes/showCollection'
import ShowUser from './routes/showUser'
import EditCollection from './routes/editcollection'
import LoginPage from './routes/loginpage'
import ErrorPage from "./error-page";
import NavBar from "./components/partials/navbar"
import Footer from "./components/partials/footer"
import Box from "@mui/material/Box"
import store from './app/store'
import {Provider} from 'react-redux'
import { resizeEvent } from 'redux-window'
import { useDispatch, useSelector } from 'react-redux'
import { setCollectionInitialState } from './app/slices/collection'
import { setListInitialState } from './app/slices/listdisplay'
import { setOnHandInitialState } from './app/slices/onhand'
import { setOptionsInitialState } from './app/slices/options'
import listStyles from '../utils/styles/componentstyles/liststyles'
import collectionLoader from '../utils/functions/collectionLoader'
import userLoader from '../utils/functions/userloader'
import getSession from '../utils/functions/backendrequests/users/getsession'
import './App.css'

//can add a bit of debounce by adding number parameter in case the event causes performance issues
resizeEvent(store)

function NavFooterWrapper() {
  return (
    <>
    <NavBar />
      <Outlet />
    <Footer />
    </>
  )
}

function Router() {
  const dispatch = useDispatch()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavFooterWrapper />,
      // errorElement: <ErrorPage />,
      loader: getSession,
      id: "root",
      children: [
        {
          path: "/",
          element: <Root />,
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: '/login',
          element: <LoginPage />
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
          loader: (params) => collectionLoader(params, dispatch, false, setListInitialState),
          children: [
            {
              path: 'edit',
              element: <EditCollection/>,
              loader: (params) => collectionLoader(params, dispatch, true, setListInitialState, setCollectionInitialState, setOnHandInitialState, setOptionsInitialState)
            }
          ]
        },
        {
          path: "/users/:id",
          element: <ShowUser/>,
          loader: userLoader
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

function App() {
  
  return (
    <>
      <Provider store={store}>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0}}>
          <Router />
        </Box>
      </Provider>
    </>
  )
}

export default App
