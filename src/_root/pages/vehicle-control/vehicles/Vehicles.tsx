import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { Table, Popover, Button, Input, Spin } from "antd";
import { MenuOutlined, HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import DragAndDropContext from "../../../components/drag-drop-table/DragAndDropContext";
import SortableHeaderCell from "../../../components/drag-drop-table/SortableHeaderCell";
import { DraggableCheckboxList } from "../../../components/drag-drop-table/DrangAndDropCheckbox";
import AddModal from "./add/Add";
import { GetListService } from "../../../../api/api";
import BreadcrumbComp from "../../../components/breadcrumb/Breadcrumb";


const breadcrumb = [
    { href: "/", title: <HomeOutlined /> },
    { title: t("araclar") },
];

const Vehicles = () => {
    const [dataSource, setDataSource] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        },
    });
    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(false);
    const [openRowHeader, setOpenRowHeader] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [keys, setKeys] = useState([]);


    const getBaseColumns = () => [
        {
            title: t("aracPlaka"),
            dataIndex: "license_plate",
            key: 1,
            render: (text, record) => (
                <Link to={`/detay/${record.vehicleId}`} className="plaka-button"><span>TR</span> <span>{text}</span></Link>
            ),
            width: 160
        },
        {
            title: t("aracTip"),
            dataIndex: "vehicle_type",
            key: 2,
        },
        {
            title: t("marka"),
            dataIndex: "brand",
            key: 3,
        },
        {
            title: t("model"),
            dataIndex: "model",
            key: 4,
        },
        {
            title: t("guncelKm"),
            dataIndex: "mileage",
            key: 5,
        },
        {
            title: t("renk"),
            dataIndex: "color",
            key: 6,
        },
        {
            title: t("yil"),
            dataIndex: "year",
            key: 7,
        },
        {
            title: t("yakitTip"),
            dataIndex: "fuel_type",
            key: 8,
        },
    ];

    const [columns, setColumns] = useState(() =>
        getBaseColumns().map((column, i) => ({
            ...column,
            key: `${i}`,
            onHeaderCell: () => ({
                id: `${i}`,
            }),
        }))
    );

    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const page = tableParams.pagination.current || 1;
            const pageSize = tableParams.pagination.pageSize || 10;
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            try {
                let url = "vehicles?order=vehicleId.asc";

                if (search) {
                    if (!isNaN(+search)) {
                        url += `&year=eq.${search}`;
                    } else {
                        const searchTerm = `%${search}%`;
                        const orFilter = `(license_plate.ilike.${searchTerm},brand.ilike.${searchTerm},model.ilike.${searchTerm},fuel_type.ilike.${searchTerm})`;
                        const encodedOrFilter = encodeURIComponent(orFilter);
                        url += `&or=${encodedOrFilter}`;
                    }
                }

                const { data, total } = await GetListService(url, {
                    headers: { Range: `${from}-${to}` },
                });

                setDataSource(data || []);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: total || 0,
                    },
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, [
        search,
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        status,
    ]);



    const handleTableChange = (pagination, filters, sorter) => {
        setLoading(true);
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataSource([]);
        }
    };

    // const filter = (data) => {
    //     setLoading(true);
    //     setStatus(true);
    //     setFilterData(data);
    // };

    // const clear = () => {
    //     setLoading(true);
    //     setFilterData({});
    // };

    const newColumns = columns.map((col) => ({
        ...col,
        hidden: !checkedList.includes(col.key),
    }));

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const moveCheckbox = (fromIndex, toIndex) => {
        const updatedColumns = [...columns];
        const [removed] = updatedColumns.splice(fromIndex, 1);
        updatedColumns.splice(toIndex, 0, removed);

        setColumns(updatedColumns);
        setCheckedList(updatedColumns.map((col) => col.key));
    };

    const content = (
        <DraggableCheckboxList
            options={options}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            moveCheckbox={moveCheckbox}
        />
    );

    if (!localStorage.getItem("selectedRowKeys"))
        localStorage.setItem("selectedRowKeys", JSON.stringify([]));

    const handleRowSelection = (row, selected) => {
        if (selected) {
            if (!keys.includes(row.aracId)) {
                setKeys((prevKeys) => [...prevKeys, row.aracId]);
            }
        } else {
            setKeys((prevKeys) => prevKeys.filter((key) => key !== row.aracId));
           
        }
    };

    useEffect(
        () => localStorage.setItem("selectedRowKeys", JSON.stringify(keys)),
        [keys]
    );


    useEffect(() => {
        const storedSelectedKeys = JSON.parse(
            localStorage.getItem("selectedRowKeys")
        );
        if (storedSelectedKeys.length) {
            setKeys(storedSelectedKeys);
        }
    }, []);

    useEffect(() => {
        const storedSelectedKeys = JSON.parse(
            localStorage.getItem("selectedRowKeys")
        );
        if (storedSelectedKeys.length) {
            setSelectedRowKeys(storedSelectedKeys);
        }
    }, [tableParams.pagination.current, search]);

    // Custom loading icon
    const customIcon = <LoadingOutlined style={{ fontSize: 36 }} className="text-primary" spin />;


    return (
        <>
            <div className="content">
                <BreadcrumbComp items={breadcrumb} />
            </div>

            <div className="content">
                <div className="flex justify-between align-center">
                    <div className="flex align-center gap-1">
                        <Popover
                            content={content}
                            placement="bottom"
                            trigger="click"
                            open={openRowHeader}
                            onOpenChange={(newOpen) => setOpenRowHeader(newOpen)}
                        >
                            <Button className="btn primary-btn">
                                <MenuOutlined />
                            </Button>
                        </Popover>
                        <Input
                            placeholder="Arama"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <AddModal setStatus={setStatus} />
                    </div>
                </div>
            </div>

            <div className="content">
                <DragAndDropContext items={columns} setItems={setColumns}>
                    <Spin spinning={loading || isInitialLoading} indicator={customIcon}>
                        <Table
                            rowKey={(record) => record.vehicleId}
                            columns={newColumns}
                            dataSource={dataSource}
                            pagination={{
                                ...tableParams.pagination,
                                showTotal: (total) => (
                                    <p className="text-info">[{total} {t("kayit")}]</p>
                                ),
                                locale: {
                                    items_per_page: `/ ${t("sayfa")}`,
                                },
                            }}
                            loading={false}
                            size="small"
                            onChange={handleTableChange}
                            rowSelection={{
                                selectedRowKeys: selectedRowKeys,
                                onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
                                onSelect: handleRowSelection,
                            }}
                            components={{
                                header: {
                                    cell: SortableHeaderCell,
                                },
                            }}
                            scroll={{
                                x: 1200
                            }}
                            locale={{
                                emptyText: "Veri Bulunamadı",
                            }}
                        />
                    </Spin>
                </DragAndDropContext>
            </div>
        </>
    )
}

export default Vehicles
