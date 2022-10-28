import { ButtonBase } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const AddItem = ({ addItem }) => {
  return (
    <ButtonBase
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: "1rem",
      }}
      onClick={() => {
        addItem({
          id: uuidv4(),
          name: "Novo item",
          description: "",
          tag: "ok",
        });
      }}
    >
      <AddRounded
        fontSize="large"
        sx={{
          color: "#233B89",
          "& path": {
            fill: "#233B89",
          },
        }}
      />
      <span>Novo</span>
    </ButtonBase>
  );
};

export default AddItem;
