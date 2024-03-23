import * as React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { DefaultValues } from "./InputForm";
const InputField = ({
  label,
  id,
  required = false,
  register,
  errors,
  currentValue,
}: {
  label: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<DefaultValues>;
  errors: FieldErrors<FieldValues>;
  currentValue?: number;
}) => {
  const inputClasses =
    "border border-solid border-gray-300 rounded-sm w-20 text-xs";
  const labelClasses = "ml-2 whitespace-nowrap text-sm mr-2 text-gray-100";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row justify-between">
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
        <div className="flex flex-row">
          <input
            id={id}
            className={inputClasses}
            type="number"
            {...register(id, { required: required, valueAsNumber: true })}
          />
          {currentValue !== undefined ? (
            <p className="text-xs w-10 text-center text-green-100">{currentValue}</p>
          ) : null}
        </div>
      </div>
      {errors?.[id] && (
        <p className="text-xs text-red-500">
          {label} is required and must be a number.
        </p>
      )}
    </div>
  );
};

export default InputField;
