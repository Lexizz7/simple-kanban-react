import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { TextField, IconButton, Menu, MenuItem, Collapse, ListItemIcon, Fade } from "@mui/material";
import {
  EditRounded,
  DeleteRounded,
  NavigateNextRounded,
  MoreVertRounded,
  SaveRounded,
} from "@mui/icons-material";

import Item from "./Item";
import AddItem from "./AddItem";

import styles from "./Column.module.css";

const Column = ({ provided, column, boardEvents }) => {
  const [collapse, setCollapse] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Collapse
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        marginRight: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 0 rgba(9,30,66,.25)",
        ...provided.draggableProps.style,
      }}
      in={!collapse}
      timeout="auto"
      collapsedSize={64}
      orientation="horizontal"
      dir="rtl"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          borderRadius: "0.5rem",
          backgroundColor: "#f1f1f1",
          color: "#212121",
          overflow: "hidden",
        }}
        dir="ltr"
      >
        <div
          {...provided.dragHandleProps}
          className={styles.header}
          style={{
            userSelect: "none",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <TextField
                autoFocus
                label="Nome"
                value={column.name}
                onChange={(e) => {
                  boardEvents.editColumn(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setIsEditing(false);
                  }
                }}
                style={{ width: "min-content", flex: 1 }}
                variant="standard"
              />
              <IconButton
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                <SaveRounded />
              </IconButton>
            </div>
          ) : (
            <h3 style={{ margin: 0, flex: 1 }}>{column.name}</h3>
          )}

          <IconButton
            size="small"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setShowMenu(true);
            }}
          >
            <MoreVertRounded />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={showMenu}
            onClose={() => {
              setShowMenu(false);
            }}
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <MenuItem
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <ListItemIcon>
                <EditRounded />
              </ListItemIcon>
              <span>Editar coluna</span>
            </MenuItem>
            <MenuItem
              onClick={() => {
                boardEvents.deleteColumn();
              }}
            >
              <ListItemIcon>
                <DeleteRounded />
              </ListItemIcon>
              <span>Excluir coluna</span>
            </MenuItem>
          </Menu>

          <IconButton
            size="small"
            onClick={() => {
              setCollapse(!collapse);
            }}
            style={{
              backgroundColor: "#233B89",
            }}
          >
            <NavigateNextRounded
              style={{
                transform: collapse ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s",
              }}
              sx={{
                "& path": {
                  fill: "#fff",
                },
              }}
            />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 500,
            maxHeight: 500,
            overflowY: "auto",
            pointerEvents: collapse ? "none" : "auto",
          }}
        >
          <Droppable droppableId={column.id} isDropDisabled={collapse}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  padding: 16,
                  minWidth: 250,
                  width: "100%",
                  flexGrow: 1,
                }}
              >
                {column.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Item provided={provided} item={item} boardEvents={boardEvents} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <AddItem addItem={boardEvents.addItem} />
      </div>
    </Collapse>
  );
};

export default Column;
