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
import RegisterPage from './routes/registerpage'
import VerifyAccount from './routes/verifyaccount'
import Auth from './routes/auth'
import SettingsPage from './routes/users/usersettings/settingspage'
import Profile from './routes/users//usersettings/profile'
import Account from './routes/users//usersettings/account'
import Privacy from './routes/users/usersettings/privacy'
import Display from './routes/users//usersettings/display'
import Other from './routes/users/usersettings/other'
import NewTrade from './routes/trades/newtrade'
import ShowTrade from './routes/trades/showTrade'
import UserNotifications from './routes/users/usernotifications'
import UserTrades from './routes/trades/userTrades'
import ErrorPage from "./error-page";
import UnknownPath from './components/partials/unknownpath'
import Error from './routes/error'
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
import tradeLoader from '../utils/functions/tradeloader'
import userTradesLoader from '../utils/functions/usertradesLoader'
import getSession from '../utils/functions/backendrequests/users/getsession'
import './App.css'
import ProtectedRoute from './components/partials/auth/protectedroute'
import PrivateRoute from './components/partials/auth/privateroute'
import AlertsProvider from './alerts/alerts-context'
import ErrorProvider from './app/contexts/errorcontext'
import { ThemeProvider } from '@mui/material'
import theme from '../utils/styles/globalstyles/theme'
import WhatAreAprimon from './routes/infopages/whatareaprimon'
import AboutUs from './routes/infopages/aboutus'
import ContactUs from './routes/infopages/contactus'
import PreRouteLogic from './components/partials/auth/preroutelogic'
import ForgotPassword from './routes/forgotpassword'
import ResetPassword from './routes/resetpassword'
import Announcements from './routes/announcements'


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

function NavFooterError() {
  return (
    <>
    <NavBar />
      <ErrorPage />
    <Footer />
    </>
  )
}

function EditCollectionComponent() {
  return(
    <>
    <EditCollection/>
    <ShowCollection/>
    </>
  )
}

function LoaderErrorHandlerWrapper({Component}) {
  const loaderData = useLoaderData()

  useEffect(() => {

  }, [])
  return (
    <Component />
  )
}

function Router() {
  const dispatch = useDispatch()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavFooterWrapper />,
      errorElement: <NavFooterError />,
      loader: getSession,
      id: "root",
      children: [
        {
          path: "/",
          element: <Root />,
        },
        {
          path: '/error',
          element: <Error />
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: '/register',
          element: <RegisterPage />
        },
        {
          path: '/verify-account',
          element: <VerifyAccount />
        },
        {
          path: '/forgot-password',
          element: <PreRouteLogic logicType='no-logged-in-user' Component={ForgotPassword}/>
        },
        {
          path: '/reset-password',
          element: <PreRouteLogic logicType='forgot-password-verify-token' Component={ResetPassword}/>
        },
        {
          path: '/announcements',
          element: <Announcements />
        },
        {
          path: '/auth',
          element: <Auth />
        },
        {
          path: '/login',
          element: <LoginPage />
        },
        {
          path: '/info',
          element: <Outlet />,
          children: [
            {
              path: 'what-are-aprimon',
              element: <WhatAreAprimon />
            },
            {
              path: 'about-us',
              element: <AboutUs />
            },
            {
              path: 'contact-us',
              element: <ContactUs />
            }
          ]
        },
        {
          path: "/collections/new",
          element: <ProtectedRoute Component={NewCollection}/>,
        },
        {
          path: "/collections/:id",
          element: <Outlet/>,
          // loader: (params) => collectionLoader(params, dispatch, false, true, setListInitialState),
          // id: 'showCollection',
          children: [
            {
              path: "",
              element: <ShowCollection/>,
              loader: (params) => collectionLoader(params, dispatch, false, true, setListInitialState),
            },
            {
              path: 'edit',
              element: <PrivateRoute Component={EditCollectionComponent} routeType='editCollection'/>,
              loader: (params) => collectionLoader(params, dispatch, true, true, setListInitialState, setCollectionInitialState, setOnHandInitialState, setOptionsInitialState)
            },
            {
              path: 'trade',
              element: 
                <ProtectedRoute 
                  Component={NewTrade} 
                  extraAuthType='newTrade'
                  // extraAuthFunc={(col, user) => user.loggedIn && !col.owner.settings.privacy.blockedUsers.includes(user.user.username)}
                  // extraAuthErrorMessage='You were blocked by this user and cannot trade with them!'
                  // extraAuthRedirectOffset={-5}
                />,
              loader: (params) => collectionLoader(params, undefined, false, false)
            }
          ]
        },
        {
          path: "/trades/:id",
          element: <ShowTrade />,
          loader: tradeLoader
        },
        {
          path: '/trades/:id/counter-offer',
          element: <PrivateRoute Component={NewTrade} routeType='tradeCounteroffer'/>,
          loader: (params) => tradeLoader(params, true)
        },
        {
          path: "/users/:username",
          element: <ShowUser/>,
          loader: userLoader
        },
        {
          path: "/users/:username/trades",
          element: <PrivateRoute Component={UserTrades} routeType='userTrades'/>,
          loader: userTradesLoader
        },
        {
          path: '/users/:username/notifications',
          element: <PrivateRoute Component={UserNotifications} routeType='userNotifications'/>,
          loader: userLoader,
          id: 'user', 
          children: [
            {
              path: ':noteId',

            }
          ]
        },
        {
          path: "/users/:username/settings",
          element: <PrivateRoute Component={SettingsPage} PlaceholderComponent={ShowUser} routeType='userSettings'/>,
          loader: userLoader,
          id: 'userSettings',
          children: [
            {
              path: 'profile',
              element: <Profile />
            },
            {
              path: 'account',
              element: <Account />
            },
            {
              path: 'display',
              element: <Display />
            },
            {
              path: 'privacy',
              element: <Privacy />
            },
            {
              path: 'other',
              element: <Other />
            },
          ]
        },
        {
          path: "*",
          element: <UnknownPath/>
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
        <ThemeProvider theme={theme}>
          <AlertsProvider>
            <ErrorProvider>
              <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0}}>
                <Router />
              </Box>
            </ErrorProvider>
          </AlertsProvider>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
