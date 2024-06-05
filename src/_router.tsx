import { FC, Suspense } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider, useNavigate } from 'react-router-dom'

import App from './App'
import Group from './modules/Group'
import Single from './modules/Single'
import SortableGroup from './modules/SortableGroup'

const SuspenseEl: any = ({ el }: any) => {
  const Element: any = el
  return (
    <Suspense fallback=''>
      <Element />
    </Suspense>
  )
}

const PageNotFound: FC<any> = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex align-items-center justify-content-center' style={{ height: '75vh' }}>
      <div className='text-center'>
        <div className='mb-3 fw-light'>The page you are looking for could not be found</div>
        <div className='btn px-4 btn-dark' onClick={() => navigate(-1)}>
          Back
        </div>
      </div>
    </div>
  )
}

const BrowserRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      Component: App,
      children: [
        { index: true, element: <SuspenseEl el={Single} /> },
        { path: 'single', element: <SuspenseEl el={Single} /> },
        { path: 'group', element: <SuspenseEl el={Group} /> },
        { path: 'sortable-group', element: <SuspenseEl el={SortableGroup} /> },
        { path: '*', element: <PageNotFound /> },
      ],
    },
  ]

  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export { BrowserRouter }
