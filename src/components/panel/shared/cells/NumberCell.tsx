import util from "config/utils";

const NumberCell = ({
  value,
  enabelCopy = true,
}: {
  value: any;
  enabelCopy?: boolean;
}) => {
  return (
    <span
      onClick={enabelCopy ? () => util.copyToClipboard(value) : undefined}
      title={value}
    >
      {util.commaThousondSeperator(
        typeof value === "string" ? parseFloat(value) : value
      )}
    </span>
  );
};
export default NumberCell;
