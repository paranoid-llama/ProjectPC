import { useState, useEffect, useRef } from 'react'
import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useLocation, defer, Await,
  useRouteLoaderData,
  redirect
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
import { initializeTotalState, setListDisplayInitialState } from './app/slices/collectionstate'
import { setOnHandInitialState } from './app/slices/onhand'
import { setOptionsInitialState } from './app/slices/options'
import listStyles from '../utils/styles/componentstyles/liststyles'
import collectionLoader from '../utils/functions/collectionLoader'
import { collectionLoaderNoDefer } from '../utils/functions/collectionLoader'
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
import { Skeleton, ThemeProvider, Typography } from '@mui/material'
import theme from '../utils/styles/globalstyles/theme'
import WhatAreAprimon from './routes/infopages/whatareaprimon'
import AboutUs from './routes/infopages/aboutus'
import ContactUs from './routes/infopages/contactus'
import PreRouteLogic from './components/partials/auth/preroutelogic'
import ForgotPassword from './routes/forgotpassword'
import ResetPassword from './routes/resetpassword'
import Announcements from './routes/announcements'
import { fetchCollectionData } from './app/slices/collectionstate'
import { ShowCollectionSkeleton, ShowUserSkeleton, ShowTradeSkeleton, UserNotificationsTradesSkeleton, UserSettingsSkeleton, NewTradeOfferSkeleton } from './components/partials/skeletons/routeskeletons'
import AdminMain from './routes/admin/adminmain'
import SendMessagesPage from './routes/admin/sendmessagespage'
import ChangeTableData from './routes/admin/changetabledata'
import adminRouter from './routebrowserobjects/adminrouter'
import BodyWrapper from './components/partials/routepartials/bodywrapper'
import getAnnouncementsFromBackend from '../utils/functions/backendrequests/api/announcements/getannouncements'

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

function InitializeStateWrapper({children, postLoaderFunc, postCompleteTools, resolvedData, comparator}) {
  if (!postLoaderFunc) {
    return children
  }
  return (
    <InitializeStateFunc postLoaderFunc={postLoaderFunc} postCompleteTools={postCompleteTools} resolvedData={resolvedData} comparator={comparator}>
      {children}
    </InitializeStateFunc>
  )
}
function InitializeStateFunc({children, postLoaderFunc, postCompleteTools, resolvedData, comparator}) {
  // if (!postLoaderFunc) {
  //   return children
  // } else {
    useEffect(() => {
      postLoaderFunc(resolvedData, postCompleteTools)
    }, comparator)
    return children
  // }
}

function DeferLoaderComponent({Component, SkeletonComponent, postCompleteTools, postLoaderFunc, loaderDataKey, isProtectedRoute=false, isPrivateRoute=false, privateProtectedRouteProps={}, isShowCollection=false, otherResolvedProps={}, routeLoaderDataInstead, routeLoaderId}) {
  const promise = routeLoaderDataInstead ? useRouteLoaderData(routeLoaderId) : useLoaderData()
  const dispatch = useDispatch()
  const userData = useRouteLoaderData('root')
  const locationData = useLocation()
  const currColPath = locationData.pathname

  return (
    <Suspense fallback={<SkeletonComponent/>}>
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
          const isCollectionOwner = (isShowCollection) && (userData.loggedIn && userData.user._id === resolvedData.owner._id)
          const postCompleteAdjust = (isShowCollection && userData.loggedIn) ? {dispatch, initList: (col) => setListDisplayInitialState({col, initOnHandView: userData.user.settings.display.defaultOnhandView, currColUrl: currColPath})} : 
            isShowCollection ? {dispatch, initList: (col) => setListDisplayInitialState({col})} : postCompleteTools
          const additionalProp = (isShowCollection) ? {isCollectionOwner} : {}
          const loaderProp = {[loaderDataKey]: resolvedData, ...otherResolvedProps}
          return (
            <InitializeStateWrapper
              postLoaderFunc={postLoaderFunc} postCompleteTools={postCompleteAdjust} resolvedData={resolvedData}
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
              <Component {...loaderProp} {...additionalProp}/>}
            </InitializeStateWrapper>
          )
        }}
      </Await>
    </Suspense>
  )
}

function DemoCollectionDeferAndReinit({Component, isEdit}) {
  const colData = useLocation().state === null ? 'none' : useLocation().state.collection
  const dispatch = useDispatch()
  const colName = useSelector((state) => state.collectionState.options.collectionName)

  useEffect(() => {
      if (colData !== 'none') {
        dispatch(initializeTotalState(colData))
      }
  })

  return (
    colData === 'none' ? 
    <BodyWrapper>
        <Box sx={{height: '750px', width: '100%', borderRadius: '10px', ...theme.components.box.fullCenterCol, justifyContent: 'start', color: 'black'}}>
            <Typography sx={{fontSize: '32px', fontWeight: 700, my: 2}}>No data was sent to load a demo collection!</Typography>
            <Typography sx={{fontSize: '24px', my: 1}}>If you think this is an error, contact us to resolve it!</Typography>
        </Box>
    </BodyWrapper> : 
  !colName ? <ShowCollectionSkeleton/> : <Component demo={true}/>
  )
}

function DemoEditCollection({}) {
  return (
    <>
      <EditCollection demo={true}/>
      <ShowCollection demo={true}/>
    </>
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
          loader: () => getAnnouncementsFromBackend(true)
        },
        {
          path: '/error',
          element: <Error />
        },
        {
          path: "/search",
          element: <Outlet/>,
          children: [
            {
              path: '',
              element: <Search type='all'/>
            },
            {
              path: 'users',
              element: <Search type='users'/>
            },
            {
              path: 'collections',
              element: <Search type='collections'/>
            }
          ]
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
          element: <Announcements />,
          // loader: () => getAnnouncementsFromBackend(false, 0)
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
          path: '/demo-collection',
          element: <Outlet/>,
          children: [
            {
              path: '',
              element:<DemoCollectionDeferAndReinit Component={ShowCollection}/>,
            },
            {
              path: 'new',
              element:<NewCollection demo={true}/>
            },
            {
              path: 'edit',
              element:<DemoCollectionDeferAndReinit Component={DemoEditCollection}/>
            },
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
                    postCompleteTools={{dispatch, initList: setListDisplayInitialState}}
                    postLoaderFunc={initializeCollectionPageState}
                    loaderDataKey='collection'
                    isShowCollection={true}
                />,
              id: 'collection',
              loader: (params) => collectionLoader(params),
              shouldRevalidate: ({ currentUrl, nextUrl }) => {
                //  current/next wording is misleading. nextUrl is always show collection page
                const notSwitchingThroughEditPage = nextUrl.pathname !== currentUrl.pathname.slice(0, -5) && nextUrl.pathname !== `${currentUrl.pathname}/edit`
                return notSwitchingThroughEditPage
              }
            },
            {
              path: 'edit',
              element: <PrivateRoute Component={EditCollectionComponent} routeType='editCollection'/>,
              loader: (params) => dispatch(fetchCollectionData(params.params.id)).then(data => data.payload),
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
          element: <Outlet/>,
          loader: userLoader,
          id: 'userNotifications', 
          shouldRevalidate: ({ currentUrl, nextUrl }) => {
            const shorterPath = currentUrl.pathname.length > nextUrl.pathname.length ? nextUrl.pathname : currentUrl.pathname
            const longerPath = shorterPath === currentUrl.pathname ? nextUrl.pathname : currentUrl.pathname
            const shouldntRevalidate = longerPath.includes(shorterPath)
            return !shouldntRevalidate
          },
          children: [
            {
              path: '',
              element: 
                <DeferLoaderComponent 
                  Component={UserNotifications}
                  SkeletonComponent={UserNotificationsTradesSkeleton}
                  loaderDataKey='userData'
                  isPrivateRoute={true}
                  privateProtectedRouteProps={{routeType: 'userNotifications'}}
                  routeLoaderDataInstead={true}
                  routeLoaderId={'userNotifications'}
                />
            },
            {
              path: ':notificationId',
              element: 
              <DeferLoaderComponent 
                Component={UserNotifications}
                SkeletonComponent={UserNotificationsTradesSkeleton}
                loaderDataKey='userData'
                isPrivateRoute={true}
                privateProtectedRouteProps={{routeType: 'userNotifications', routeSubType: 'singleNotification'}}
                otherResolvedProps={{useNoteId: true}}
                routeLoaderDataInstead={true}
                routeLoaderId={'userNotifications'}
              />
              // <PrivateRoute 
              //   Component={UserNotifications}
              //   SkeletonComponent={UserNotificationsTradesSkeleton}
              //   routeType='userNotifications'
              //   customRouteLoaderDataProp={{name: 'userData', id: 'userNotifications'}}
              // />
            }
          ]
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
        ...adminRouter,
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
