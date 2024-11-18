import React from 'react';

type Props = {
  errors?: string[];
  name: string;
};

export default function TextArea({
  errors,
  name,
  ...otherProps
}: Props & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
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
