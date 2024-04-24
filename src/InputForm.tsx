import { SetStateAction, useEffect } from "react";
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
  topTubeHeight: number;
  headTubeAngle: number;
  headTubeLength: number;
  forkLength: number;
  forkOffset: number;
  stack: number;
  reach: number;
  seatStayOffset: number;
  rearPivotToAxleLength: number;
  layoutType: "horst" | "singlePivot";
  wheelLayout: "29er" | "mullet" | "27";
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
  topTubeHeight: 375,
  headTubeAngle: 65,
  headTubeLength: 100,
  forkLength: 565,
  forkOffset: 44,
  stack: 631,
  reach: 510,
  seatStayOffset: 10,
  rearPivotToAxleLength: 20,
  layoutType: "singlePivot",
  wheelLayout: "29er",
};

const InputForm = ({
  setNewValues,
  setIsOpen,
  layoutValues,
  updateFromList,
}: {
  setNewValues: React.Dispatch<SetStateAction<DefaultValues>>;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  layoutValues: DefaultValues;
  updateFromList: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultValues });
  const inputClasses =
    "border border-solid border-gray-300 rounded-sm bg-blue-200";

  const onSubmit = (data: DefaultValues) => {
    console.log("handling submit");
    
    setNewValues(data);
  };

  const preventEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  useEffect(() => {
    reset(layoutValues);
  }, [updateFromList]);

  return (
    <form onBlur={handleSubmit((data) => onSubmit(data))} onKeyPress={preventEnter}>
      <div className="flex flex-row gap-2 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-gray-100 text-xl font-bold">Geometry Inputs</h2>
          <div className="flex flex-row gap-2 ml-2 justify-between">
            <label className="text-sm text-gray-100">Linkage Type</label>
            <select {...register("layoutType")} className="p-0">
              <option value="singlePivot">Single Pivot</option>
              <option value="horst">Horst Link</option>
            </select>
          </div>
          <div className="flex flex-row gap-2 ml-2 justify-between">
            <label className="text-sm text-gray-100">Wheel Layout</label>
            <select {...register("wheelLayout")} className="p-0">
              <option value="29er">29er</option>
              <option value="mullet">Mullet</option>
              <option value="27">27.5</option>
            </select>
          </div>
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
            label="Top Tube Height"
            id="topTubeHeight"
            required
            register={register}
            errors={errors}
            currentValue={layoutValues.topTubeHeight}
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
          {layoutValues.layoutType === "singlePivot" ? (
            <>
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
            </>
          ) : null}
          {layoutValues.layoutType === "horst" ? (
            <>
              <InputField
                label="Seat Stay Offset"
                id="seatStayOffset"
                required
                register={register}
                errors={errors}
                currentValue={layoutValues.seatStayOffset}
              />
              <InputField
                label="Rear Pivot to Axle"
                id="rearPivotToAxleLength"
                required
                register={register}
                errors={errors}
                currentValue={layoutValues.rearPivotToAxleLength}
              />
            </>
          ) : null}
          <div className="flex flex-row gap-2">
            <input className={`${inputClasses} max-w-max p-2`} type="submit" />
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-200 border-gray-300 border border-solid rounded-sm p-2"
              type="button"
            >
              Save Layout
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
