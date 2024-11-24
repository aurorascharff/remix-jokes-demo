import React from 'react';

type Props = {
  errors?: string[];
  name: string;
  label: string;
};

export default function TextArea({
  errors,
  name,
  label,
  ...otherProps
}: Props & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        className={errors ? 'outline outline-2 outline-red' : ''}
        aria-describedby="error"
        {...otherProps}
      />
      {errors && <span className="text-red">{errors[0]}</span>}
    </div>
  );
}
