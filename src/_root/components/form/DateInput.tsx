import { Controller, useFormContext } from 'react-hook-form'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import tr_TR from 'antd/lib/locale/tr_TR'
import { ConfigProvider, DatePicker } from 'antd'

dayjs.locale('tr')

const DateInput = ({ name, checked, readonly, required }) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required ? "Bu alan boş bırakılamaz!" : false }}
            render={({ field, fieldState }) => (
                <>
                    {/* ConfigProvider ile `tr_TR`'yi kullanarak yerelleştirme yapıyoruz */}
                    <ConfigProvider locale={tr_TR}>
                        <DatePicker
                            {...field}
                            placeholder=""
                            className={fieldState.error ? 'input-error' : ''}
                            disabled={checked}
                            readOnly={readonly}
                            format="DD.MM.YYYY"
                            onChange={e => {
                                field.onChange(e)
                            }}
                        />
                    </ConfigProvider>
                    {fieldState.error && <span style={{ color: 'red' }}>{fieldState.error.message}</span>}
                </>
            )}
        />
    )
}

export default DateInput
