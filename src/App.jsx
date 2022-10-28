import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { ButtonBase } from "@mui/material";
import { FavoriteRounded } from "@mui/icons-material";
import Column from "./components/Column";
import AddColumn from "./components/AddColumn";
import GithubLogo from "./assets/github.svg";
const columnsDefault = [
  {
    id: uuidv4(),
    name: "A fazer",
    items: [
      { id: uuidv4(), name: "Item 1", description: "Descrição do item 1", tag: "error" },
      { id: uuidv4(), name: "Item 2", description: "Descrição do item 2", tag: "warning" },
    ],
  },
  {
    id: uuidv4(),
    name: "Fazendo",
    items: [{ id: uuidv4(), name: "Item 3", description: "Descrição do item 3", tag: "ok" }],
  },
  {
    id: uuidv4(),
    name: "Feito",
    items: [
      { id: uuidv4(), name: "Item 4", description: "Descrição do item 4", tag: "ok" },
      { id: uuidv4(), name: "Item 5", description: "Descrição do item 5", tag: "warning" },
      { id: uuidv4(), name: "Item 6", description: "Descrição do item 6", tag: "error" },
      { id: uuidv4(), name: "Item 7", description: "Descrição do item 7", tag: "ok" },
    ],
  },
];

const onDragEnd = (result, columns, setColumns, setPlaceholderProps) => {
  setPlaceholderProps({});
  if (!result.destination) return;

  const { source, destination } = result;

  if (source.droppableId === "board" || destination.droppableId === "board") {
    const newColumns = [...columns];
    const [removed] = newColumns.splice(source.index, 1);
    newColumns.splice(destination.index, 0, removed);
    setColumns(newColumns);
    return;
  }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns.find((column) => column.id === source.droppableId);
    const destColumn = columns.find((column) => column.id === destination.droppableId);
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns(
      columns.map((column) => {
        if (column.id === source.droppableId) {
          return {
            ...column,
            items: sourceItems,
          };
        }
        if (column.id === destination.droppableId) {
          return {
            ...column,
            items: destItems,
          };
        }
        return column;
      })
    );
  } else {
    const column = columns.find((column) => column.id === source.droppableId);
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns(
      columns.map((column) => {
        if (column.id === source.droppableId) {
          return {
            ...column,
            items: copiedItems,
          };
        }
        return column;
      })
    );
  }
};

const queryAttr = "data-rbd-drag-handle-draggable-id";
const queryDropzone = "data-rbd-droppable-id";
const getDraggedDom = (draggableId) => {
  const domQuery = `[${queryAttr}='${draggableId}']`;
  const draggedDOM = document.querySelector(domQuery);

  return draggedDOM;
};
const getDropzone = (droppableId) => {
  const domQuery = `[${queryDropzone}='${droppableId}']`;
  const dropzone = document.querySelector(domQuery);

  return dropzone;
};
const handleDragStart = (event, setPlaceholderProps) => {
  const draggedDOM = getDraggedDom(event.draggableId);
  if (!draggedDOM) {
    return;
  }

  const { clientHeight, clientWidth } = draggedDOM;
  const sourceIndex = event.source.index;
  const closestDropzone = getDropzone(event.source.droppableId);

  const childrenArray = [...closestDropzone.children];
  const movedItem = childrenArray[sourceIndex];
  childrenArray.splice(sourceIndex, 1);

  let clientY;
  let clientX;
  let height = 0;
  let width = 0;
  if (event.type && event.type.toLowerCase().includes("column")) {
    clientY = parseFloat(window.getComputedStyle(closestDropzone).paddingTop);
    clientX =
      parseFloat(window.getComputedStyle(closestDropzone).paddingLeft) +
      [...closestDropzone.children].slice(0, sourceIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginRight = parseFloat(style.marginRight);
        return total + curr.clientWidth + marginRight;
      }, 0);
    height = draggedDOM.parentNode.clientHeight;
    width = draggedDOM.closest(".MuiCollapse-root").clientWidth;
  } else {
    clientY =
      parseFloat(window.getComputedStyle(closestDropzone).paddingTop) +
      [...closestDropzone.children].slice(0, sourceIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);
    clientX = parseFloat(window.getComputedStyle(closestDropzone).paddingLeft);
    height = clientHeight;

    width = clientWidth;
  }

  setPlaceholderProps({
    clientHeight: height,
    clientWidth: width,
    clientY: clientY + closestDropzone.getBoundingClientRect().top + window.scrollY,
    clientX: clientX + closestDropzone.getBoundingClientRect().left,
  });
};

const handleDragUpdate = (event, setPlaceholderProps) => {
  if (!event.destination) {
    return;
  }
  const draggedDOM = getDraggedDom(event.draggableId);

  if (!draggedDOM) {
    return;
  }

  const { clientHeight, clientWidth } = draggedDOM;

  const destinationIndex = event.destination.index;
  const sourceIndex = event.source.index;

  const closestDropzone = getDropzone(event.destination.droppableId);

  const childrenArray = [...closestDropzone.children];
  const movedItem = childrenArray[sourceIndex];
  childrenArray.splice(sourceIndex, 1);

  const updatedArray = [
    ...childrenArray.slice(0, destinationIndex),
    movedItem,
    ...childrenArray.slice(destinationIndex + 1),
  ];

  let clientY;
  let clientX;
  let height = 0;
  let width = 0;
  if (event.type && event.type.toLowerCase().includes("column")) {
    clientY = parseFloat(window.getComputedStyle(closestDropzone).paddingTop);
    clientX =
      parseFloat(window.getComputedStyle(closestDropzone).paddingLeft) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginRight = parseFloat(style.marginRight);
        return total + curr.clientWidth + marginRight;
      }, 0);
    height = draggedDOM.parentNode.clientHeight;
    width = draggedDOM.closest(".MuiCollapse-root").clientWidth;
  } else {
    clientY =
      parseFloat(window.getComputedStyle(closestDropzone).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);
    clientX = parseFloat(window.getComputedStyle(closestDropzone).paddingLeft);
    height = clientHeight;
    width = clientWidth;
  }

  setPlaceholderProps({
    clientHeight: height,
    clientWidth: width,
    clientY: clientY + closestDropzone.getBoundingClientRect().top + window.scrollY,
    clientX: clientX + closestDropzone.getBoundingClientRect().left,
  });
};

const addItem = (columnId, columns, setColumns, item) => {
  const newColumns = [...columns];
  const newColumn = newColumns.find((column) => column.id === columnId);
  newColumn.items.push(item);
  setColumns(newColumns);
};

const editItem = (columnId, itemId, columns, setColumns, item) => {
  const newColumns = [...columns];
  const newColumn = newColumns.find((column) => column.id === columnId);
  const newItem = newColumn.items.find((item) => item.id === itemId);
  newItem.title = item.title;
  newItem.description = item.description;
  newItem.tag = item.tag;
  setColumns(newColumns);
};

const deleteItem = (columnId, itemId, columns, setColumns) => {
  const newColumns = [...columns];
  const newColumn = newColumns.find((column) => column.id === columnId);
  newColumn.items = newColumn.items.filter((item) => item.id !== itemId);
  setColumns(newColumns);
};

const addColumn = (columns, setColumns, column) => {
  const newColumns = [...columns];
  newColumns.push(column);
  setColumns(newColumns);
};

const editColumn = (columnId, columns, setColumns, name) => {
  const newColumns = [...columns];
  const newColumn = newColumns.find((column) => column.id === columnId);
  newColumn.name = name;
  setColumns(newColumns);
};

const deleteColumn = (columnId, columns, setColumns) => {
  const newColumns = [...columns];
  newColumns.splice(
    newColumns.findIndex((column) => column.id === columnId),
    1
  );
  setColumns(newColumns);
};

const App = () => {
  const [columns, setColumns] = useState(columnsDefault);
  const [placeholderProps, setPlaceholderProps] = useState({});

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          paddingTop: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>React Kanban para integração de API:</h2>
        <h5 style={{ margin: 0 }}>Modelo Drag and Drop para Desktop</h5>
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
            overflowX: "auto",
            padding: "1rem",
          }}
        >
          <DragDropContext
            onDragEnd={(e) => {
              onDragEnd(e, columns, setColumns, setPlaceholderProps);
            }}
            onDragUpdate={(e) => {
              handleDragUpdate(e, setPlaceholderProps);
            }}
            onDragStart={(e) => {
              handleDragStart(e, setPlaceholderProps);
            }}
          >
            <Droppable droppableId="board" direction="horizontal" type="column">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  {columns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided) => (
                        <Column
                          provided={provided}
                          column={column}
                          boardEvents={{
                            addItem: (item) => addItem(column.id, columns, setColumns, item),
                            editItem: (itemId, item) =>
                              editItem(column.id, itemId, columns, setColumns, item),
                            deleteItem: (itemId) =>
                              deleteItem(column.id, itemId, columns, setColumns),
                            addColumn: (column) => addColumn(columns, setColumns, column),
                            editColumn: (name) => editColumn(column.id, columns, setColumns, name),
                            deleteColumn: () => deleteColumn(column.id, columns, setColumns),
                          }}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {Object.keys(placeholderProps).length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: placeholderProps.clientY,
                        left: placeholderProps.clientX,
                        height: placeholderProps.clientHeight,
                        background: "rgba(0,0,0,0.1)",
                        border: "4px dashed #233B89",
                        borderRadius: "0.5rem",
                        width: placeholderProps.clientWidth,
                      }}
                    />
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AddColumn addColumn={(column) => addColumn(columns, setColumns, column)} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "auto",
          gap: "0.5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            // shadow gradient
            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
            zIndex: -1,
          }}
        />
        <p>Feito com </p>
        <FavoriteRounded
          sx={{
            "& path": {
              fill: "red",
            },
          }}
        />
        <p>por Edmar de Oliveira</p>

        <ButtonBase
          tyle={{
            display: "flex",
            borderRadius: "0.5rem",
            gap: "0.5rem",
            overflow: "hidden",
          }}
        >
          <a
            href="https://github.com/Lexizz7/Kanban-React"
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              gap: "0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            <img src={GithubLogo} alt="Github" style={{ width: "1.5rem" }} />
            <p>Github</p>
          </a>
        </ButtonBase>
      </div>
    </>
  );
};

export default App;
