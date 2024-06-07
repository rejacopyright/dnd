import { FC, useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'

const Index: FC<{
  show: boolean
  setShow: (e: boolean) => void
  detail: any
  onSubmit?: (e: any) => void
}> = ({ detail, show, setShow, onSubmit = () => '' }) => {
  const inputRef = useRef<any>(null)
  const [value, setValue] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (show) {
      setValue(detail?.title)
      inputRef?.current?.focus?.()
    }
    return () => {
      setValue('')
    }
  }, [show, detail])

  const handleOnSubmit = (e: any) => {
    e?.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShow(false)
      onSubmit(value)
    }, 100)
  }
  return (
    <Modal
      scrollable
      centered={false}
      dialogClassName='modal-md'
      show={show}
      onHide={() => setShow(false)}>
      <Modal.Header closeButton className='bg-light-danger'>
        <Modal.Title className='small'>Update Group</Modal.Title>
      </Modal.Header>
      <form action='' onSubmit={handleOnSubmit}>
        <Modal.Body className='p-5'>
          <label className='form-floating d-block'>
            <input
              ref={inputRef}
              type='text'
              className='form-control border-light'
              placeholder='name@example.com'
              defaultValue={detail?.title}
              onChange={(e: any) => {
                setValue(e?.target?.value)
              }}
            />
            <label>Card Name</label>
          </label>
        </Modal.Body>
        <Modal.Footer className='py-2 px-1'>
          <div className='row w-100'>
            <div className='col-auto ps-0 ms-auto'>
              <div className='btn btn-light text-dark' onClick={() => setShow(false)}>
                Cancel
              </div>
            </div>
            <div className='col-auto ps-0'>
              <button type='submit' disabled={loading || !value} className='btn btn-dark'>
                {loading ? (
                  <span className='indicator-progress text-nowrap' style={{ display: 'block' }}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default Index
