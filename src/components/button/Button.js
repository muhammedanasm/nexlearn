import "./button.css";

export default function Button({
  text,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button type={type} onClick={onClick} className={`common-btn ${className}`}>
      {text}
    </button>
  );
}
