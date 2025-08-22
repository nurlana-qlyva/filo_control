import { t } from 'i18next'
import TextInput from '../../../../components/form/TextInput';
import SelectboxInput from '../../../../components/form/SelectboxInput';
import NumberInput from '../../../../components/form/NumberInput';
import LicensePlateInput from '../../../../components/form/LicensePlateInput';
import DateInput from '../../../../components/form/DateInput';

const GeneralInfo = ({ isValid }) => {
    const validateStyle = {
        borderColor: isValid === "error" ? "#dc3545" :
            isValid === "success" ? "#23b545" :
                "#000",
    };

    return (
        <>
            <div className="grid gap-1 border">
                <div className="col-span-8 p-10">
                    <div className="grid gap-1">
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("plaka")} <span className="text-danger">*</span></label>
                                <LicensePlateInput style={validateStyle} required={true} />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("aracTip")} <span className="text-danger">*</span></label>
                                <SelectboxInput type="vehicle_type" required={true} urlName="vehicle_type" />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("guncelKm")}</label>
                                <NumberInput name="miliage" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 p-10">
                    <div className="flex flex-col gap-1">
                        <label>{t("lokasyon")} <span className="text-danger">*</span></label>
                        <SelectboxInput type="location" required={true} urlName="cities" />
                    </div>
                </div>
            </div>

            <div className="grid gap-1 mt-10">
                <div className="col-span-8 border p-10">
                    <h3 className="sub-title">{t("aracBilgileri")}</h3>
                    <div className="grid gap-1 mt-10">
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("marka")} <span className="text-danger">*</span></label>
                                <SelectboxInput type="brand" required={true} urlName="brands" />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("model")} <span className="text-danger">*</span></label>
                                <SelectboxInput type="model" required={true} urlName="models" />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("yil")}</label>
                                <NumberInput name="year" />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("renk")}</label>
                                <SelectboxInput type="color" urlName="colors" />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("surucu")} <span className="text-danger">*</span></label>
                                <TextInput name="driver" required={true} />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col gap-1">
                                <label>{t("yakitTip")} <span className="text-danger">*</span></label>
                                <SelectboxInput type="fuel_type" urlName="fuel_types" required={true} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 border p-10">
                    <h3 className="sub-title">{t("yenilenmeTarihleri")}</h3>
                    <div className="grid gap-1 mt-10">
                        <div className="col-span-6">
                            <div className="flex flex-col gap-1">
                                <label className='text-info'>{t("muayeneTarihi")}</label>
                                <DateInput name="inspection_date" />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col gap-1">
                                <label className='text-info'>{t("sozlesmeTarihi")}</label>
                                <DateInput name="contract_date" />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col gap-1">
                                <label className='text-info'>{t("egzozTarihi")}</label>
                                <DateInput name="emission_test_date" />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col gap-1">
                                <label className='text-info'>{t("vergiTarihi")}</label>
                                <DateInput name="tax_date" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GeneralInfo;
