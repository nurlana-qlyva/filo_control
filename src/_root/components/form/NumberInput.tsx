import { InputNumber } from "antd"
import { Controller, useFormContext } from "react-hook-form"

const NumberInput = ({ name, checked, required }) => {
    const { control, setValue } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required ? "Bu alan boş bırakılamaz!" : false }}
            render={({ field, fieldState }) => (
                <>
                    <InputNumber
                        {...field}
                        className={fieldState.error ? 'input-error w-full' : 'w-full'}
                        readOnly={checked}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        parser={(value) => value.replace(/\D/g, '')}
                        onChange={(e) => {
                            field.onChange(e);
                            if (e === null) {
                                setValue(name, 0);
                            }
                        }}
                    />
                    {fieldState.error && <span style={{ color: 'red' }}>{fieldState.error.message}</span>}
                </>
            )}
        />
    )
}

export default NumberInput
