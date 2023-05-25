import { useEffect } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";

export const useLeavePageConfirmation = (
  showAlert = true,
  message = "途中経過は保存されません。よろしいでしょうか？"
) => {
  useBeforeUnload(showAlert, message);

  useEffect(() => {
    const handler = () => {
      if (showAlert && !window.confirm(message)) {
        throw "キャンセル";
      }
    };

    Router.events.on("routeChangeStart", handler);

    return () => {
      Router.events.off("routeChangeStart", handler);
    };
  }, [showAlert, message]);
};
