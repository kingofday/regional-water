import SharedContext from "context/SharedContext";
import { useEffect, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next"
import { useSetRecoilState } from "recoil";
interface PageProps {
    id?: string;
    title: string;
    children: ReactNode;
    className?: string
}
const Page = ({ id, title, className, children }: PageProps) => {
    const { t } = useTranslation();
    const {setTitle} = useContext(SharedContext);
    useEffect(() => {
        setTitle(t(title) ?? "");
    }, [])
    return <div id={id} className={`page${className ? " " + className : ""}`}>
        {children}
    </div>;
};
export default Page;