const tagsColor = {
  error: "#f44336",
  warning: "#ff9800",
  ok: "#4caf50",
};
const Item = ({ provided, item }) => {
  return (
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
  );
};

export default Item;
