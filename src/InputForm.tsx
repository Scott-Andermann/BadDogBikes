import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";

export interface DefaultValues {
  bellcrankX: number;
  bellcrankY: number;
  bellcrankA: number;
  bellcrankB: number;
  bellcrankC: number;
  shockMin: number;
  shockMax: number;
  shockMountX: number;
  shockMountY: number;
  swingarmPivotX: number;
  swingarmPivotY: number;
  seatStay: number;
  chainStay: number;
  bbDrop: number;
  axleOffsetX: number;
  axleOffsetY: number;
  seatTubeAngle: number;
  headTubeAngle: number;
  headTubeLength: number;
  forkLength: number;
  forkOffset: number;
  stack: number;
  reach: number;
}

export const defaultValues: DefaultValues = {
  bellcrankX: 12,
  bellcrankY: 150,
  bellcrankA: 80,
  bellcrankB: 100,
  bellcrankC: 130,
  shockMin: 130,
  shockMax: 185,
  shockMountX: -55,
  shockMountY: 25,
  swingarmPivotX: -10,
  swingarmPivotY: 30,
  seatStay: 421,
  bbDrop: 20,
  chainStay: 450,
  axleOffsetX: 10,
  axleOffsetY: 10,
  seatTubeAngle: 80,
  headTubeAngle: 65,
  headTubeLength: 100,
  forkLength: 565,
  forkOffset: 44,
  stack: 631,
  reach: 510,
};

const InputForm = ({
  setNewValues,
  setIsOpen,
  layoutValues,
}: {
  setNewValues: React.Dispatch<SetStateAction<DefaultValues>>;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  layoutValues: DefaultValues;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });
  const inputClasses =
    "border border-solid border-gray-300 rounded-sm bg-blue-200";

  const onSubmit = (data: DefaultValues) => {
    setNewValues(data);
  };
  const headTubeAngle = (layoutValues.headTubeAngle * Math.PI) / 180;

  const wheelbase =
    layoutValues.reach +
    layoutValues.headTubeLength * Math.cos(headTubeAngle) +
    layoutValues.forkLength * Math.cos(headTubeAngle) +
    Math.cos(Math.asin(layoutValues.bbDrop / layoutValues.chainStay)) * layoutValues.chainStay;
  const stack =
    layoutValues.bbDrop +
    (layoutValues.forkLength + layoutValues.headTubeLength) *
      Math.sin(headTubeAngle);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-row gap-2">
        <input className={`${inputClasses} max-w-max p-2`} type="submit" />
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-200 border-gray-300 border border-solid rounded-sm p-2"
        >
          Save Layout
        </button>
      </div>
      <div className="flex flex-row gap-2 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-100">Bike Geometry</h3>
          <InputField
            label="Head Tube Angle"
            id="headTubeAngle"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.headTubeAngle}
          />
          <InputField
            label="Head Tube Length"
            id="headTubeLength"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.headTubeLength}
          />
          <InputField
            label="Fork Axle to Crown"
            id="forkLength"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.forkLength}
          />
          <InputField
            label="Fork Offset"
            id="forkOffset"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.forkOffset}
          />
          <InputField
            label="Reach"
            id="reach"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.reach}
          />
          <InputField
            label="Seat Tube Angle"
            id="seatTubeAngle"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.seatTubeAngle}
          />
          <InputField
            label="BB Drop"
            id="bbDrop"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bbDrop}
          />
          <InputField
            label="Chainstay Length"
            id="chainStay"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.chainStay}
          />
          <p className="text-gray-100">
            Stack Height: {Math.abs(Math.round(stack))}
          </p>
          <p className="text-gray-100">Wheelbase: {Math.round(wheelbase)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-100">Bellcrank Position</h3>
          <InputField
            label="Bellcrank X"
            id="bellcrankX"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bellcrankX}
          />
          <InputField
            label="Bellcrank Y"
            id="bellcrankY"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bellcrankY}
          />
          <h3 className="text-gray-100">Bellcrank Geometry</h3>
          <InputField
            label="Bellcrank A"
            id="bellcrankA"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bellcrankA}
          />
          <InputField
            label="Bellcrank B"
            id="bellcrankB"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bellcrankB}
          />
          <InputField
            label="Bellcrank C"
            id="bellcrankC"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.bellcrankC}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-100">Shock Mount Position</h3>
          <InputField
            label="Shock X"
            id="shockMountX"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.shockMountX}
          />
          <InputField
            label="Shock Y"
            id="shockMountY"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.shockMountY}
          />
          <h3 className="text-gray-100">Shock Lengths</h3>
          <InputField
            label="Minimum Shock Length"
            id="shockMin"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.shockMin}
          />
          <InputField
            label="Maximum Shock Length"
            id="shockMax"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.shockMax}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-100">Rear Triangle Geometry</h3>
          <InputField
            label="Swingarm Pivot X"
            id="swingarmPivotX"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.swingarmPivotX}
          />
          <InputField
            label="Swingarm Pivot Y"
            id="swingarmPivotY"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.swingarmPivotY}
          />
          <InputField
            label="Axle Offset X"
            id="axleOffsetX"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.axleOffsetX}
          />
          <InputField
            label="Axle Offset Y"
            id="axleOffsetY"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.axleOffsetY}
          />
        </div>
      </div>
    </form>
  );
};

export default InputForm;
