import * as Io5Icons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import PropTypes from "prop-types";
const CustomIcon = ({
  name,
  className,
  size = 16,
  ...props
}: {
  name: string;
  className?: string;
  size?: number;
  [key: string]: any;
}) => {
  const FoundIcon =
    Io5Icons[name as keyof typeof Io5Icons] ||
    BsIcons[name as keyof typeof BsIcons] ||
    FaIcons[name as keyof typeof FaIcons] ||
    MdIcons[name as keyof typeof MdIcons];
  return FoundIcon ? (
    <FoundIcon
      size={size}
      className={`custom-icon${className ? " " + className : ""}`}
      {...props}
    />
  ) : null;
};
CustomIcon.propTypes = {
  name: PropTypes.string.isRequired,
};
export default CustomIcon;
