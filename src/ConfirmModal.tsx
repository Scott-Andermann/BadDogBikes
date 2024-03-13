import { SetStateAction, useState, useRef, useEffect, useCallback } from "react";
import { AxlePaths } from "./App";
import { Position } from "./data/draw";

interface ConfirmModalProps {
  isOpen: boolean;
  setAxlePaths: React.Dispatch<SetStateAction<AxlePaths[]>>;
  rearPivotPosition: Position[];
  onClose: () => void;
}

const ConfirmModal = ({
  isOpen,
  setAxlePaths,
  rearPivotPosition,
  onClose,
}: ConfirmModalProps) => {
  const [title, setTitle] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const setColor = useCallback(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  }, []);

  const handleSaveLayout = () => {
    setAxlePaths((prev) => [
      ...prev,
      { path: rearPivotPosition, title: title, color: setColor() },
    ]);
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleCloseButton = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  useEffect(() => {
    const { current: el } = modalRef;
    if (isOpen) el?.showModal();
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      onClose={onClose}
      className={`top-0 left-0 bg-black bg-opacity-25 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center m-0`}
    >
      <div className="w-80 h-80 bg-white rounded-lg p-4 flex flex-col gap-2">
        Confirm
        <label htmlFor="title">Enter Name of Layout</label>
        <input
          type="text"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleSaveLayout}>Save Layout</button>
        <button onClick={handleCloseButton}>Close</button>
      </div>
    </dialog>
  );
};

export default ConfirmModal;
