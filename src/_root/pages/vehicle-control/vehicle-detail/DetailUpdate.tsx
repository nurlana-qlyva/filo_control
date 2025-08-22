import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { t } from "i18next";
import dayjs from "dayjs";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Image, message, Spin, Tabs, Upload } from "antd";
import BreadcrumbComp from "../../../components/breadcrumb/Breadcrumb";
import TextInput from "../../../components/form/TextInput";
import SelectboxInput from "../../../components/form/SelectboxInput";
import NumberInput from "../../../components/form/NumberInput";
import { GetVehicleImagesService, UploadImageService } from "../../../../api/api";

const { Dragger } = Upload;

const breadcrumb = [
  { href: "/", title: <HomeOutlined /> },
  { href: "/araclar", title: t("araclar") },
  { title: t("aracDetayKarti") },
];

const DetailUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState([]);
  const [urls, setUrls] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState({
    aktif: false,
    lokasyon: "",
    guncelKm: 0,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [kmHistryModal, setKmHistryModal] = useState(false);
  const [guncelKmTarih, setGuncelKmTarih] = useState("");
  const [activeKey, setActiveKey] = useState("1");
  // file
  const [filesUrl, setFilesUrl] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  // photo
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [images, setImages] = useState([]);

  const defaultValues = {};
  const methods = useForm({
    defaultValues: defaultValues,
  });
  const { setValue, handleSubmit } = methods;

  const onSubmit = handleSubmit((values) => {

  });

  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      const urls = await GetVehicleImagesService("vehicle_images", id);
      setImageUrls(urls);
      if (urls.length > 0) {
        setProfile(urls[0]); // tek URL string
      }
      setLoadingImages(false);
    };

    fetchImages();
  }, [id]);

  const handleUpload = async (file) => {
    setLoadingImages(true);
    const publicUrl = await UploadImageService(file, "vehicle_images", id);
    if (publicUrl) {
      setImageUrls((prev) => [...prev, publicUrl]);
      message.success("Resim yüklendi!");
    } else {
      message.error("Resim yüklenemedi!");
    }
    setLoadingImages(false);
  };


  const items = [
    {
      key: "1",
      label: t("genelBilgiler"),
      children: <div>Genel bilgiler form alanları burada...</div>,
    },
    {
      key: "2",
      label: `[${imageUrls.length}] ${t("resimler")}`,
      children: (
        <>
          {loadingImages ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          ) : (
            <div className="flex gap-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
              ))}
            </div>
          )}

          <Dragger
            accept=".png,.jpg,.jpeg"
            beforeUpload={(file) => {
              const isImage = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
              const isLt2M = file.size / 1024 / 1024 < 2;

              if (!isImage) {
                message.error("Sadece PNG, JPG veya JPEG yükleyebilirsiniz!");
                return Upload.LIST_IGNORE;
              }
              if (!isLt2M) {
                message.error("Resim boyutu 2MB'dan küçük olmalıdır!");
                return Upload.LIST_IGNORE;
              }

              handleUpload(file);
              return false; // Ant Design'ın otomatik yüklemesini engeller
            }}
          >
            <p className="ant-upload-drag-icon">
              <HomeOutlined />
            </p>
            <p className="ant-upload-text">Tıklayın veya sürükleyip bırakın</p>
            <p className="ant-upload-hint">
              Tek seferde bir veya birden fazla resim yükleyebilirsiniz.
            </p>
          </Dragger>
        </>
      ),
    },
  ];

  const footer = [
    <Button
      key="back"
      className="btn cancel-btn"
      onClick={() => setKmHistryModal(false)}
    >
      {t("kapat")}
    </Button>,
  ];

  const handleCancel = () => navigate("/araclar");

  return (
    <>
      {loading && (
        <div className="loading-spin">
          <div className="loader">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 100,
                  }}
                  spin
                />
              }
            />
          </div>
        </div>
      )}

      <div className="content">
        <BreadcrumbComp items={breadcrumb} />
      </div>

      <FormProvider {...methods}>
        <div className="content">
          <div className="grid">
            <div className="col-span-3">
              <div className="profile-photo">
                {profile ? (
                  <img
                    src={profile}
                    alt="Profil Fotoğrafı"
                    style={{ width: 150, height: 150, objectFit: "cover", borderRadius: "8px" }}
                  />
                ) : (
                  <div className="no-photo">Fotoğraf yok</div>
                )}
              </div>
            </div>
            <div className="col-span-9">
              <div className="grid p-10 gap-1">
                <div className="col-span-12 flex gap-1 justify-end mb-10">
                  <Button
                    className="btn btn-min primary-btn"
                    onClick={onSubmit}
                  >
                    {t("guncelle")}
                  </Button>
                  <Button
                    className="btn btn-min cancel-btn"
                    onClick={handleCancel}
                  >
                    {t("kapat")}
                  </Button>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="plaka">{t("plaka")}</label>
                    <TextInput name="license_plate" />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label>
                      {t("aracTip")} <span className="text-danger">*</span>
                    </label>
                    <SelectboxInput
                      type="vehicle_type"
                      required={true}
                      urlName="vehicle_type"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="grid gap-1">
                    <div className="col-span-10">
                      <div className="flex flex-col gap-1">
                        <label className="flex gap-2">
                          <span>{t("guncelKm")}</span>{" "}
                          <span className="text-info">
                            {guncelKmTarih
                              ? `[ ${dayjs(guncelKmTarih).format(
                                "DD.MM.YYYY"
                              )} ]`
                              : null}
                          </span>
                        </label>
                        <NumberInput name="guncelKm" checked={true} />
                      </div>
                    </div>
                    <div className="col-span-2 self-end">
                      <Button
                        className="w-full"
                        style={{ padding: "4px 0" }}
                        onClick={() => setKmHistryModal(true)}
                      >
                        ...
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="lokasyonId">
                      {t("lokasyon")} <span className="text-danger">*</span>
                    </label>
                    <SelectboxInput
                      type="location"
                      required={true}
                      urlName="cities"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="markaId">
                      {t("marka")} <span className="text-danger">*</span>
                    </label>
                    <SelectboxInput
                      type="brand"
                      required={true}
                      urlName="brands"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="modelId">
                      {t("model")} <span className="text-danger">*</span>
                    </label>
                    <SelectboxInput
                      type="model"
                      required={true}
                      urlName="models"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="surucuId">{t("surucu")}</label>
                    <TextInput name="driver" />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="yakitTipId">
                      {t("yakitTip")} <span className="text-danger">*</span>
                    </label>
                    <SelectboxInput
                      type="fuel_type"
                      required={true}
                      urlName="fuel_types"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="aracRenkId">{t("renk")}</label>
                    <SelectboxInput
                      type="color"
                      required={true}
                      urlName="colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content relative">
          {/* <DetailInfo id={id} /> */}
          <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
        </div>
      </FormProvider>
    </>
  );
};

export default DetailUpdate;
