import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import InputField from "./InputField";

export interface HumanInputProps {
  humanHeight: number;
  humanInseam: number;
  crankLength: 175;
}

interface Props {
  setHumanInput: React.Dispatch<React.SetStateAction<HumanInputProps>>;
}

const HumanInputs = ({setHumanInput}: Props) => {
  const inputClasses =
    "border border-solid border-gray-300 rounded-sm w-20 text-xs";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const storedInputs = localStorage.getItem("BDBHumanInputs");

    if (storedInputs !== null) {
      setHumanInput(JSON.parse(storedInputs));
    }
  }, []);

  const onSubmit = (data: FieldValues) => {
    setHumanInput(data as HumanInputProps);
    localStorage.setItem("BDBHumanInputs", JSON.stringify(data))
  };
  return (
    <div>
      <h2>Human Inputs</h2>
      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="flex">
        <InputField
          label="Height"
          id="humanHeight"
          register={register}
          errors={errors}
        />
        <InputField
          label="Inseam"
          id="humanInseam"
          register={register}
          errors={errors}
        />
        <InputField
          label="Crank Length"
          id="crankLength"
          register={register}
          errors={errors}
        />
        <input className={`${inputClasses} max-w-max p-2`} type="submit" />
      </form>
    </div>
  );
};

export default HumanInputs;
