// Modal as a separate component
import { FunctionComponent, PropsWithChildren, useEffect, useRef } from "react"
import "./style.css"

interface ModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  isOpen,
  setIsOpen,
  children,
}) => {
  const ref = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [isOpen])

const closeModal = () => setIsOpen(false)

  return (
    <dialog ref={ref} onCancel={closeModal}>
      <div className="modal" onClick={closeModal}>
        <div className="modal--content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </dialog>
  )
}

export default Modal
