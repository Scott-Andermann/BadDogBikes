import * as React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { DefaultValues } from "./InputForm";
const InputField = ({
  label,
  id,
  required = false,
  register,
  errors,
}: {
  label: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<DefaultValues>;
  errors: FieldErrors<FieldValues>;
}) => {
  const inputClasses = "border border-solid border-gray-300 rounded-sm w-20 text-xs";
  const labelClasses = "ml-2 whitespace-nowrap text-sm mr-2";
  return (
    <div className="flex flex-row justify-between">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        id={id}
        className={inputClasses}
        type="number"
        {...register(id, { required: required, valueAsNumber: true })}
      />
      {errors?.[id] && <p>{label} is required and must be a number.</p>}
    </div>
  );
};

export default InputField;
