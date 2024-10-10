import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'

//components
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import About from './pages/About.tsx'
import Login from './pages/auth/Login.tsx'
import Contact from './pages/Contact.tsx'
import Home from './pages/Home.tsx'
import Signup from './pages/auth/Signup.tsx'

//actions
/* import { action as signupAction } from './pages/auth/Signup.tsx'
 *//* import { action as loginAction } from './pages/auth/Login.tsx'
 */

//toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//redux
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Dashboard from './pages/admin/Dashboard.tsx'
import PrivatePage from './pages/PrivatePage.tsx'
import CreatePost from './pages/admin/CreatePost.tsx'
import OnlyIsAdminPrivatePage from './pages/admin/OnlyIsAdminPrivatePage.tsx'
import UpdatePost from './pages/admin/UpdatePost.tsx'
import PostPage from './pages/post/PostPage.tsx'
import SearchPage from './pages/SearchPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'login',
        element: <Login />
        /*         action: loginAction
         */
      },
      {
        path: 'signup',
        element: <Signup />
        /*         action: signupAction
         */
      },
      {
        path: 'post/:slug',
        element: <PostPage />
      },
      {
        element: <PrivatePage />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          }
        ]
      },
      {
        element: <OnlyIsAdminPrivatePage />,
        children: [
          {
            path: 'create-post',
            element: <CreatePost />
          },
          {
            path: 'edit-post/:id',
            element: <UpdatePost />
          }
        ]
      }
    ]
  }
])

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    <ToastContainer />
  </React.StrictMode>
)
