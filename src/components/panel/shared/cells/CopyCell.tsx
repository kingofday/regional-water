import CustomIcon from "components/shared/CustomIcon";
import util from "config/utils";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const CopyCell = ({ value }: { value: any }) => {
    const { t } = useTranslation();
    const [cn, setCN] = useState("")
    const ref = useRef<NodeJS.Timeout>();
    const handleCopy = () => {
        if (ref.current) clearTimeout(ref.current);
        setCN("animate__fadeIn");
        util.copyToClipboard(value);
        ref.current = setTimeout(() => {
            setCN("")
        }, 2000)
    }
    return <span className={`copy animate__animated ${cn}`} onClick={() => handleCopy()}>
        {value} <CustomIcon name="IoCopyOutline"  title={t("copy") ?? ""}/>
    </span>
}
export default CopyCell;