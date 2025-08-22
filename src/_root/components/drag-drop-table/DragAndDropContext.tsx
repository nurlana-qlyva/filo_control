import { createContext, useContext, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';

// `dragIndex`'i genişletiyoruz ve direction'ı ekliyoruz.
type DragIndexState = {
    active: string | null; // string yerine number da olabilir, ihtiyaçlarınıza göre tip değiştirilebilir
    over: string | null;
    direction?: 'left' | 'right'; // direction'ı isteğe bağlı olarak ekliyoruz
};

const DragIndexContext = createContext<DragIndexState>({
    active: null,
    over: null,
});

export const useDragIndex = () => useContext(DragIndexContext);

const DragAndDropContext = ({ children, items, setItems }) => {
    const [dragIndex, setDragIndex] = useState<DragIndexState>({
        active: null,
        over: null,
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }) => {
        console.log(1);
        if (active.id !== over?.id) {
            setItems((prevState) => {
                const activeIndex = prevState.findIndex((i) => i.key === active.id);
                const overIndex = prevState.findIndex((i) => i.key === over.id);
                return arrayMove(prevState, activeIndex, overIndex);
            });
        }
        setDragIndex({
            active: null,
            over: null,
        });
    };

    const onDragOver = ({ active, over }) => {
        const activeIndex = items.findIndex((i) => i.key === active.id);
        const overIndex = items.findIndex((i) => i.key === over?.id);

        // `direction` bilgisini ekliyoruz.
        setDragIndex({
            active: active.id,
            over: over?.id,
            direction: overIndex > activeIndex ? 'right' : 'left',
        });
    };

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            collisionDetection={closestCenter}
        >
            <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                <DragIndexContext.Provider value={dragIndex}>
                    {children}
                </DragIndexContext.Provider>
            </SortableContext>
            <DragOverlay>
                <th style={{ backgroundColor: 'gray', padding: 16 }}>
                    {items[items.findIndex((i) => i.key === dragIndex.active)]?.title}
                </th>
            </DragOverlay>
        </DndContext>
    );
};

export default DragAndDropContext;
