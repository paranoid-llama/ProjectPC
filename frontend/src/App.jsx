import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useLocation, defer, Await
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
import { collectionLoaderEditPage } from '../utils/functions/collectionLoader'
import { initializeCollectionPageState } from '../utils/functions/collectionLoader'
import userLoader from '../utils/functions/userloader'
import tradeLoader from '../utils/functions/tradeloader'
import userTradesLoader from '../utils/functions/usertradesLoader'
import getSession from '../utils/functions/backendrequests/users/getsession'
import './App.css'
import ProtectedRoute from './components/partials/auth/protectedroute'
import PrivateRoute from './components/partials/auth/privateroute'
import AlertsProvider from './alerts/alerts-context'
import ErrorProvider from './app/contexts/errorcontext'
import { Skeleton, ThemeProvider } from '@mui/material'
import theme from '../utils/styles/globalstyles/theme'
import WhatAreAprimon from './routes/infopages/whatareaprimon'
import AboutUs from './routes/infopages/aboutus'
import ContactUs from './routes/infopages/contactus'
import PreRouteLogic from './components/partials/auth/preroutelogic'
import ForgotPassword from './routes/forgotpassword'
import ResetPassword from './routes/resetpassword'
import Announcements from './routes/announcements'
import { ShowCollectionSkeleton, ShowUserSkeleton, ShowTradeSkeleton, UserNotificationsTradesSkeleton, UserSettingsSkeleton, NewTradeOfferSkeleton } from './components/partials/skeletons/routeskeletons'


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
      <ErrorPage/>
    <Footer />
    </>
  )
}

function EditCollectionComponent({}) {
  return(
    <>
    <EditCollection />
    <ShowCollection />
    </>
  )
}

function InitializeStateFunc({children, postLoaderFunc, postCompleteTools, resolvedData}) {
  if (!postLoaderFunc) {
    return children
  }
  useEffect(() => {
    postLoaderFunc(resolvedData, postCompleteTools)
  }, [])
  return children
}

function DeferLoaderComponent({Component, SkeletonComponent, postCompleteTools, postLoaderFunc, loaderDataKey, isProtectedRoute=false, isPrivateRoute=false, privateProtectedRouteProps={}}) {
  const promise = useLoaderData()
  const fallbackProp = SkeletonComponent ? {fallback: <SkeletonComponent />} : {}

  return (
    <Suspense {...fallbackProp}>
      <Await
        resolve={promise.resolvedData}
      >
        {(resolvedData) => {
          const errorResolved = resolvedData.status === 400 || resolvedData.status === 500 || resolvedData.status === 401 || resolvedData.status === 402 || resolvedData.status === 403 || resolvedData.status === 404
          if (errorResolved) {
            return (
              <ErrorPage errorData={resolvedData}/>
            )
          }
          const loaderProp = {[loaderDataKey]: resolvedData}
          // if (postLoaderFunc) {
          //   postLoaderFunc(resolvedData, postCompleteTools)
          // }
          return (
            <InitializeStateFunc
              postLoaderFunc={postLoaderFunc} postCompleteTools={postCompleteTools} resolvedData={resolvedData}
            >
              {isProtectedRoute ? 
              <ProtectedRoute Component={Component} PlaceholderComponent={SkeletonComponent} {...privateProtectedRouteProps} loaderData={resolvedData} loaderDataProp={loaderProp}/> : 
              isPrivateRoute ? 
              <PrivateRoute 
                Component={Component}
                PlaceholderComponent={SkeletonComponent}
                loaderDataProp={loaderProp}
                loaderData={resolvedData}
                {...privateProtectedRouteProps}
              /> : 
              <Component {...loaderProp}/>}
            </InitializeStateFunc>
          )
        }}
      </Await>
    </Suspense>
  )
}

// function LoaderErrorHandlerWrapper({Component}) {
//   const loaderData = useLoaderData()

//   useEffect(() => {

//   }, [])
//   return (
//     <Component />
//   )
// }

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
              element: 
                <DeferLoaderComponent 
                  Component={ShowCollection} 
                  SkeletonComponent={ShowCollectionSkeleton} 
                  postCompleteTools={{dispatch, initList: setListInitialState}} 
                  postLoaderFunc={initializeCollectionPageState}
                  loaderDataKey='collection'
                />,
              loader: (params) => collectionLoader(params) 
              // element: <ShowCollection/>,
              // loader: (params) => collectionLoader(params, dispatch, false, true, setListInitialState),
            },
            {
              path: 'edit',
              // element: 
              //   <DeferLoaderComponent 
              //     Component={EditCollectionComponent}
              //     postCompleteTools={{dispatch, initList: setListInitialState, initCol: setCollectionInitialState, initOnhand: setOnHandInitialState, initOptions: setOptionsInitialState, editPage: true}} 
              //     postLoaderFunc={initializeCollectionPageState}
              //     loaderDataKey='collection'
              //     isPrivateRoute={true}
              //     privateProtectedRouteProps={{routeType: 'editCollection'}}
              //   />,
              // loader: (params) => collectionLoader(params) 
              element: <PrivateRoute Component={EditCollectionComponent} routeType='editCollection'/>,
              loader: (params) => collectionLoaderEditPage(params, dispatch, setListInitialState, setCollectionInitialState, setOnHandInitialState, setOptionsInitialState)
            },
            {
              path: 'trade',
              element: 
                <DeferLoaderComponent 
                  Component={NewTrade} 
                  SkeletonComponent={NewTradeOfferSkeleton} 
                  loaderDataKey='loaderData'
                  isProtectedRoute={true}
                  privateProtectedRouteProps={{extraAuthType: 'newTrade'}}
                />,
              loader: (params) => collectionLoader(params) 
                // <ProtectedRoute 
                  // Component={NewTrade} 
                  // extraAuthType='newTrade'
                  // extraAuthFunc={(col, user) => user.loggedIn && !col.owner.settings.privacy.blockedUsers.includes(user.user.username)}
                  // extraAuthErrorMessage='You were blocked by this user and cannot trade with them!'
                  // extraAuthRedirectOffset={-5}
                // />,
              // loader: (params) => collectionLoader(params, undefined, false, false),
            }
          ]
        },
        {
          path: "/trades/:id",
          // element: <ShowTrade />,
          element: 
            <DeferLoaderComponent 
              Component={ShowTrade}
              SkeletonComponent={ShowTradeSkeleton}
              loaderDataKey='tradeAndLOfferData'
            />,
          loader: tradeLoader,

        },
        {
          path: '/trades/:id/counter-offer',
          // element: <PrivateRoute Component={NewTrade} routeType='tradeCounteroffer'/>,
          element: 
            <DeferLoaderComponent
              Component={NewTrade}
              SkeletonComponent={NewTradeOfferSkeleton}
              loaderDataKey='loaderData'
              isPrivateRoute={true}
              privateProtectedRouteProps={{routeType: 'tradeCounteroffer'}}
            />,
          loader: (params) => tradeLoader(params, true),
        },
        {
          path: "/users/:username",
          // element: <ShowUser/>,
          element: 
            <DeferLoaderComponent 
              Component={ShowUser}
              SkeletonComponent={ShowUserSkeleton}
              loaderDataKey='userData'
            />,
          loader: userLoader,
          
        },
        {
          path: "/users/:username/trades",
          // element: <PrivateRoute Component={UserTrades} routeType='userTrades'/>,
          element: 
            <DeferLoaderComponent 
              Component={UserTrades}
              SkeletonComponent={UserNotificationsTradesSkeleton}
              loaderDataKey='userAndTheirTradesData'
              isPrivateRoute={true}
              privateProtectedRouteProps={{routeType: 'userTrades'}}
            />,
          loader: userTradesLoader,
        },
        {
          path: '/users/:username/notifications',
          // element: <PrivateRoute Component={UserNotifications} routeType='userNotifications'/>,
          element: 
            <DeferLoaderComponent 
              Component={UserNotifications}
              SkeletonComponent={UserNotificationsTradesSkeleton}
              loaderDataKey='userData'
              isPrivateRoute={true}
              privateProtectedRouteProps={{routeType: 'userNotifications'}}
            />,
          loader: userLoader,
          id: 'user', 
        },
        {
          path: "/users/:username/settings",
          // element: <PrivateRoute Component={SettingsPage} PlaceholderComponent={ShowUser} routeType='userSettings'/>,
          element: 
            <DeferLoaderComponent 
              Component={SettingsPage}
              SkeletonComponent={UserSettingsSkeleton}
              loaderDataKey='userData'
              isPrivateRoute={true}
              privateProtectedRouteProps={{routeType: 'userSettings'}}
            />,
          loader: userLoader,
          id: 'userSettings',
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
