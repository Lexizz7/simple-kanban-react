import { useState } from "react";
import { Modal, TextField, Box, Select, MenuItem, Button } from "@mui/material";
const tagsColor = {
  error: "#f44336",
  warning: "#ff9800",
  ok: "#4caf50",
};
const Item = ({ provided, item, boardEvents }) => {
  const [showModal, setShowModal] = useState(false);
  const [editInfo, setEditInfo] = useState({
    name: item.name,
    description: item.description,
    tag: item.tag,
  });

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: "none",
          width: "100%",
          margin: "0 0 8px 0",
          minHeight: "50px",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 0 rgba(9,30,66,.25)",
          display: "flex",
          ...provided.draggableProps.style,
        }}
        onClick={() => setShowModal(true)}
      >
        <div
          style={{
            height: "inherit",
            backgroundColor: tagsColor[item.tag],
            width: "4px",
            borderRadius: "0.5rem 0 0 0.5rem",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <h4 style={{ margin: 0 }}>{item.name}</h4>
          <span>{item.description}</span>
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            background: "white",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2>Editar item</h2>
          <TextField
            label="Nome"
            defaultValue={item.name}
            fullWidth
            onChange={(e) => {
              setEditInfo({ ...editInfo, name: e.target.value });
            }}
          />
          <TextField
            label="Descrição"
            defaultValue={item.description}
            fullWidth
            onChange={(e) => {
              setEditInfo({ ...editInfo, description: e.target.value });
            }}
          />
          <Select
            defaultValue={item.tag}
            onChange={(e) => {
              setEditInfo({ ...editInfo, tag: e.target.value });
            }}
          >
            <MenuItem value="error">Importante</MenuItem>
            <MenuItem value="warning">Prioridade</MenuItem>
            <MenuItem value="ok">Normal</MenuItem>
          </Select>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#233B89",
            }}
            color="primary"
            onClick={() => {
              boardEvents.editItem(item.id, editInfo);
              setShowModal(false);
            }}
          >
            Salvar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              boardEvents.deleteItem(item.id);
              setShowModal(false);
            }}
          >
            Excluir
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Item;
