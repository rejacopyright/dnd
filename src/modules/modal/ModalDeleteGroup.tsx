import { FC, useState } from 'react'
import { Modal } from 'react-bootstrap'

const Index: FC<{
  show: boolean
  setShow: (e: boolean) => void
  detail: any
  onSubmit?: (e: any) => void
}> = ({ show, setShow, detail, onSubmit = () => '' }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleOnSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShow(false)
      onSubmit(detail?.title)
    }, 100)
  }
  return (
    <Modal
      scrollable
      centered={false}
      dialogClassName='modal-md'
      show={show}
      onHide={() => setShow(false)}>
      {/* <Modal.Header closeButton className='bg-light-danger p-5' /> */}
      <Modal.Body className='p-5'>
        <div className='text-center'>
          <span>Are you sure want to remove</span>
          <span className='fw-bolder mx-1'>{detail?.title || 'this'}</span>
          <span>from the list of group ?</span>
        </div>
      </Modal.Body>
      <Modal.Footer className='py-2 px-1'>
        <div className='row w-100'>
          <div className='col-auto ps-0 ms-auto'>
            <div className='btn btn-light text-dark' onClick={() => setShow(false)}>
              Cancel
            </div>
          </div>
          <div className='col-auto ps-0'>
            <button
              type='button'
              onClick={handleOnSubmit}
              disabled={loading}
              className='btn btn-danger'>
              {loading ? (
                <span className='indicator-progress text-nowrap' style={{ display: 'block' }}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              ) : (
                <span>Remove</span>
              )}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default Index
