import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const LicensePlateInput = ({ length, style, readonly, required }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name="license_plate"
            control={control}
            rules={{ required: required ? "Bu alan boş bırakılamaz!" : false }}
            render={({ field, fieldState }) => (
                <>
                    <Input
                        {...field}
                        maxLength={length}
                        style={{
                            ...style,
                        }}
                        readOnly={readonly}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                        }}
                    />
                    {fieldState.error && (
                        <span style={{ color: "red" }}>{fieldState.error.message}</span>
                    )}
                </>
            )}
        />
    )
}

export default LicensePlateInput
