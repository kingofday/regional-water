import { Button } from "antd";
import util from "config/utils";
import React, { ReactNode } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import styles from "assets/styles/error-boundry.module.scss"

interface Props extends WithTranslation {
    children?: ReactNode;
    message?: string,
    fallback: () => void
}

interface State {
    error: any;
    errorInfo: any;
}
class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null, errorInfo: null };
        this.prevPath = null;
        this.retry = this.retry.bind(this);
        this.sendError = this.sendError.bind(this);
    }
    public prevPath: string | null;
    sendError(error: any) {
        let errorStr = error?.toString() ?? "unknown";
        util.sendReport("error", error
            .toString()
            .substring(0, errorStr.length < 300 ? errorStr.length : 300));
    }
    static getDerivedStateFromError(error: any) {
        return { error: true, errorInfo: error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.log(error);
        this.sendError(error);
    }
    componentDidUpdate() {
        if (window.location?.pathname !== this.prevPath)
            this.setState({ error: null, errorInfo: null });
        this.prevPath = window.location?.pathname;
    }
    componentDidMount() {
        this.prevPath = window.location?.pathname;
    }
    retry() {
        window.location.reload();
    }
    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            return (
                <div className={styles.errorBoundry}>
                    <p className="message">
                        {this.props.message ?? this.props.t("unknownError")}
                    </p>
                    <Button onClick={this.retry}>
                        {this.props.t("retry")}
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
export default withTranslation()(ErrorBoundary);
