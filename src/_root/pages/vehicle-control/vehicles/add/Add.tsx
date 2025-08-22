import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { t } from "i18next";
import { Button, Modal } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import GeneralInfo from "./GeneralInfo";
import { CreateCarInfoService, GetListService } from "../../../../../api/api";

const AddModal = ({ setStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isValid, setIsValid] = useState("normal");
    const [loading, setLoading] = useState(false);

    const defaultValues = {};
    const methods = useForm({
        defaultValues: defaultValues,
    });
    const { handleSubmit, reset, watch } = methods;
    const handleOk = handleSubmit(async (value) => {
        const body = {
            license_plate: value.license_plate,
            vehicle_type: value.vehicle_type,
            miliage: value.miliage,
            location: value.location,
            brand: value.brand,
            model: value.model,
            year: value.year,
            driver: value.driver,
            fuel_type: value.fuel_type,
            contract_date: value.contract_date,
            color: value.color,
            emission_test_date: value.emission_test_date,
            inspection_date: value.inspection_date,
            tax_date: value.tax_date,
        };

        setLoading(true);
        try {
            const data = await CreateCarInfoService(body);

            if (data === null) {
                setIsModalOpen(false);
                reset(defaultValues);
                setIsValid("normal");
                setStatus(prev => !prev);
            } else {
                console.error("Insert failed");
            }
        } catch (error) {
            console.error("Error creating vehicle:", error);
        } finally {
            setLoading(false);
        }
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = "vehicles?order=vehicleId.asc";

                if (watch("license_plate")) {
                    const searchTerm = `%${watch("license_plate")}%`;
                    const orFilter = `(license_plate.ilike.${searchTerm})`;
                    const encodedOrFilter = encodeURIComponent(orFilter);
                    url += `&or=${encodedOrFilter}`;
                }

                if (watch("license_plate").length > 0) {
                    const { data } = await GetListService(url);
                    if (data.length > 0) {
                        setIsValid("error")
                    } else {
                        setIsValid("success")
                    }
                } else if (watch("license_plate").length === 0) setIsValid("normal")



            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [watch("license_plate")])

    const footer = [
        loading ? (
            <Button className="btn btn-min primary-btn">
                <LoadingOutlined />
            </Button>
        ) : (
            <Button
                key="submit"
                className="btn btn-min primary-btn"
                onClick={handleOk}
                disabled={
                    isValid === "error" || isValid === "normal" ? true : isValid === "success" ? false : false
                }
            >
                {t("kaydet")}
            </Button>
        ),
        <Button
            key="back"
            className="btn btn-min cancel-btn"
            onClick={() => {
                setIsModalOpen(false);
                reset(defaultValues);
                setIsValid("normal");
            }}
        >
            {t("kapat")}
        </Button>,
    ];

    return (
        <div>
            <Button
                className="btn primary-btn"
                onClick={() => {
                    setIsModalOpen(true);
                }}
            >
                <PlusOutlined /> {t("ekle")}
            </Button>
            <Modal
                title={t("yeniAracGiris")}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    reset(defaultValues);
                    setIsValid("normal");
                }}
                maskClosable={false}
                footer={footer}
                width={1200}
            >
                <FormProvider {...methods}>
                    <form>
                        <GeneralInfo isValid={isValid} />
                    </form>
                </FormProvider>
            </Modal>
        </div>
    );
};

export default AddModal;
