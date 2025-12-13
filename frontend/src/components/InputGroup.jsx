// src/components/InputGroup.jsx
import React from 'react';

const InputGroup = ({ label, name, children, required = true, helperText = null }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {helperText && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
    </div>
);

export default InputGroup;