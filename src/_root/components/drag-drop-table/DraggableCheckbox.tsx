import { useRef } from "react";
// Eğer react-dnd kullanıyorsanız, bunu yerine @dnd-kit/sortable kullanabilirsiniz.
import { useDrag, useDrop } from "@dnd-kit/sortable"; // @dnd-kit/sortable'dan import ediyoruz
import { DndContext } from "@dnd-kit/core"; // @dnd-kit/core'dan DndContext import ediyoruz
import { Checkbox } from "antd";

// TypeScript'te PropTypes kullanmaya gerek yok. Props'ları tiplerle tanımlıyoruz.
interface DraggableCheckboxProps {
    id: string | number;
    index: number;
    moveCheckbox: (dragIndex: number, hoverIndex: number) => void;
    label: string;
    value: string | number;
    checkedList: (string | number)[];
    setCheckedList: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}

const DraggableCheckbox: React.FC<DraggableCheckboxProps> = ({
    id,
    index,
    moveCheckbox,
    label,
    value,
    checkedList,
    setCheckedList
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [, drop] = useDrop({
        accept: "checkbox",
        hover(item: { index: number }, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect!.bottom - hoverBoundingRect!.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect!.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveCheckbox(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "checkbox",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }}>
            <Checkbox
                checked={checkedList.includes(value)}
                onChange={(e) => {
                    if (e.target.checked) {
                        setCheckedList([...checkedList, value]);
                    } else {
                        setCheckedList(checkedList.filter((item) => item !== value));
                    }
                }}
            >
                {label}
            </Checkbox>
        </div>
    );
};

const Content = ({
    options,
    checkedList,
    setCheckedList,
    moveCheckbox
}: {
    options: { value: string | number; label: string }[];
    checkedList: (string | number)[];
    setCheckedList: React.Dispatch<React.SetStateAction<(string | number)[]>>;
    moveCheckbox: (dragIndex: number, hoverIndex: number) => void;
}) => (
    <DndContext>
        {options.map((option, index) => (
            <DraggableCheckbox
                key={option.value}
                id={option.value}
                index={index}
                moveCheckbox={moveCheckbox}
                label={option.label}
                value={option.value}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
            />
        ))}
    </DndContext>
);

export default Content;
