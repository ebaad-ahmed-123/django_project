import React from "react";

export default function InputField({ 
  label, 
  id, 
  containerClassName = "form-group",
  error,
  touched,
  ...props }) {
  return (
    <div className={`input-field-container ${containerClassName}`}>

      {label && <label htmlFor={id}>{label}</label>}
      <input 
        id={id} 
        {...props} 
      />
      {touched && error && (
        <p className="form-error-text">{error}</p>
      )}

    </div>
  );
}