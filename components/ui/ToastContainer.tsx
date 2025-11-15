import React, { useContext } from 'react';
import { ToastStateContext } from '../../context/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500" />,
  info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
};

const ToastContainer: React.FC = () => {
  const toasts = useContext(ToastStateContext);

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animation-popIn"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">{icons[toast.type]}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
