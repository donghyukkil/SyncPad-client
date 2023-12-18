import { ReactNode, CSSProperties, MouseEventHandler } from "react";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: string;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  style,
  children,
  ...props
}) => {
  return (
    <button
      className={style}
      onClick={onClick}
      {...props}
      style={{ border: "none", outline: "none" } as CSSProperties}
    >
      {children}
    </button>
  );
};

export default Button;
