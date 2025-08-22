import { Select } from "antd";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { GetListService } from "../../../api/api";

const SelectboxInput = ({ type, required, urlName }) => {
    const [dataSource, setDataSource] = useState([]);
    const { watch, control } = useFormContext();

    const handleClick = async () => {
        let url = `${urlName}?order=id.asc`;
        const { data } = await GetListService(url);
        setDataSource(data)
    };

    return (
        <Controller
            name={type}
            control={control}
            rules={{ required: required ? "Bu alan boş bırakılamaz!" : false }}
            render={({ field, fieldState }) => (
                <>
                    <Select
                        {...field}
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        className={fieldState.error ? "input-error" : ""}
                        filterOption={(input, option) =>
                            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                            (optionA?.label.toLowerCase() ?? "")
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={dataSource.map((item) => ({
                            label: item.name,
                            value: item.name,
                        }))}
                        value={watch(type)}
                        onClick={handleClick}
                        onChange={(e) => {
                            field.onChange(e);
                        }}
                    />
                    {fieldState.error && (
                        <span style={{ color: "red" }}>{fieldState.error.message}</span>
                    )}
                </>
            )}
        />
    );
}

export default SelectboxInput
