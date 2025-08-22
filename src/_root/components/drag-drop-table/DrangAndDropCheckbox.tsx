import { Checkbox } from "antd";

export function DraggableCheckboxList({ options, checkedList, setCheckedList, moveCheckbox }) {

    return (
        <div>
            {options.map((option, index) => (
                <div
                    key={option.value}
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const fromIndex = Number(e.dataTransfer.getData("text/plain"));
                        moveCheckbox(fromIndex, index);
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px",
                        border: "1px solid #ccc",
                        marginBottom: 4,
                        cursor: "move",
                        backgroundColor: "#fff",
                    }}
                >
                    <Checkbox
                        value={option.value}
                        checked={checkedList.includes(option.value)}
                        onChange={(e) => {
                            const newChecked = e.target.checked
                                ? [...checkedList, option.value]
                                : checkedList.filter((v) => v !== option.value);
                            setCheckedList(newChecked);
                        }}
                    >
                        {option.label}
                    </Checkbox>
                    <span style={{ marginLeft: "auto", cursor: "grab" }}>⇅</span>
                </div>
            ))}
        </div>
    );
}
