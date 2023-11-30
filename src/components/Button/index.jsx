const Button = ({ onClick, style, children, ...props }) => {
  return (
    <button
      className={style}
      onClick={onClick}
      {...props}
      style={{ border: "none", outline: "none" }}
    >
      {children}
    </button>
  );
};

export default Button;
