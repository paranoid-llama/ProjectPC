import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Virtuoso } from 'react-virtuoso';

const TestList = () => {
  const [items, setItems] = useState(() => {
    return Array.from({ length: 100 }, (_, k) => ({
      id: `id:${k}`,
      text: `item ${k}`,
    }));
  });

  const reorder = React.useCallback((list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }, []);

  const onDragEnd = React.useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      if (result.source.index === result.destination.index) {
        return;
      }

      setItems(items => reorder(items, result.source.index, result.destination.index))
    },
    [setItems, reorder]
  );

  const Item = React.useMemo(() => {
    return ({ provided, item, isDragging }) => {
      // For borders and visual space,
      // use container with padding rather than a margin
      // margins confuse virtuoso rendering
      return (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{ ...provided.draggableProps.style, paddingBottom: '8px' }}
        >
          <div
            style={{
              border: `1px solid ${isDragging ? 'red' : 'black'}`,
            }}
          >
            {item.text}
          </div>
        </div>
      );
    };
  }, []);

  const HeightPreservingItem = React.useMemo(() => {
    return ({ children, ...props }) => {
      return (
        // the height is necessary to prevent the item container from collapsing, which confuses Virtuoso measurements
        <div {...props} style={{ height: props['data-known-size'] || undefined }}>
          {children}
        </div>
      );
    };
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(provided, snapshot, rubric) => (
            <Item provided={provided} isDragging={snapshot.isDragging} item={items[rubric.source.index]} />
          )}
        >
          {provided => {
            return (
              <Virtuoso
                components={{
                  Item: HeightPreservingItem,
                }}
                scrollerRef={provided.innerRef}
                data={items}
                style={{ height: 500 }}
                itemContent={(index, item) => {
                  return (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {provided => <Item provided={provided} item={item} isDragging={false} />}
                    </Draggable>
                  );
                }}
              />
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TestList;