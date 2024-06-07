import last from 'lodash/last'
import { FC, Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const App: FC<any> = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const [lastPath, setLastPath] = useState<any>()

  useEffect(() => {
    setLastPath(last(location?.pathname?.split('/') || []))
  }, [location?.pathname])

  return (
    <Suspense fallback=''>
      <div className='container'>
        <nav className='navbar sticky-top py-0'>
          <div className='container-fluid justify-content-center bg-white pt-3 pb-3'>
            <div className='btn-group btn-group-pill'>
              <div
                onClick={() => navigate('single')}
                className={`btn btn-${['single', '']?.includes(lastPath) ? 'dark' : 'outline-dark'}`}>
                Single
              </div>
              <div
                onClick={() => navigate('group')}
                className={`btn btn-${['group']?.includes(lastPath) ? 'dark' : 'outline-dark'}`}>
                Group
              </div>
              <div
                onClick={() => navigate('sortable-group')}
                className={`btn btn-${['sortable-group']?.includes(lastPath) ? 'dark' : 'outline-dark'}`}>
                Sortable Group
              </div>
              <div
                onClick={() => navigate('dynamic')}
                className={`btn btn-${['dynamic']?.includes(lastPath) ? 'dark' : 'outline-dark'}`}>
                Dynamic
              </div>
            </div>
          </div>
        </nav>
        <div className='container-fluid mb-5'>
          <Outlet />
        </div>
      </div>
    </Suspense>
  )
}

export default App
