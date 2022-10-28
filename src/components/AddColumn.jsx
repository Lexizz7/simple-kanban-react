import { ButtonBase } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const AddColumn = ({ addColumn }) => {
  return (
    <ButtonBase
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        borderRadius: "0.5rem",
        backgroundColor: "rgb(230 255 230)",
        color: "#212121",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: "1rem",
        boxShadow: "0 1px 0 rgba(9,30,66,.25)",
        width: 250,
        minWidth: 250,
        height: "inherit",
      }}
      onClick={() => {
        addColumn({
          id: uuidv4(),
          name: "Nova coluna",
          items: [],
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

export default AddColumn;
