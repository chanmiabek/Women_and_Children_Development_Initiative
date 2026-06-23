import React from 'react';
import { PaystackButton as ReactPaystackButton } from 'react-paystack';

export function PaystackButton({ config, disabled, label, onClose, onFallback, onSuccess }) {
  const baseClass = 'w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60';
  const componentProps = {
    ...config,
    text: label,
    onSuccess: (reference) => onSuccess(reference),
    onClose
  };

  if (!config.enabled) {
    return (
      <button type="button" disabled={disabled} onClick={onFallback} className={baseClass}>
        {label}
      </button>
    );
  }

  return (
    <ReactPaystackButton {...componentProps} className={baseClass} disabled={disabled} />
  );
}
