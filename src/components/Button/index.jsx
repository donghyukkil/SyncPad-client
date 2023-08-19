const Button = ({ onClick, style, children, ...props }) => {
  return (
    <button className={style} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
