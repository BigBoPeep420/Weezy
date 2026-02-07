import { emmet } from "emmet-elem";
import { stringToElement } from "../modules/utils/domParse.js";
import { locationSearch } from "../components/locationSearch/locationSearch.js";
import iconAlert from "@/assets/icons/alert-rhombus.svg";

export default function (weezy, content) {
  const errorMsg = createErrorMsg();
  const outer = emmet(`div#viewHome`);

  const search = locationSearch(errorMsg);

  outer.append(errorMsg);
  return outer;

  function createErrorMsg() {
    let msgTimer = null;
    const outer = emmet(`div.errorMsg`);
    const icon = stringToElement(iconAlert, "svg");
    icon.classList.add("icon");

    const msg = emmet(`p.msg`);
    outer.append(icon, msg);

    function showErrorMsg(msg) {
      msg.textContent = msg;
      if (msgTimer) {
        clearTimeout(msgTimer);
        msgTimer = null;
      }
      msgTimer = setTimeout(() => {
        hideErrorMsg();
      }, 4000);
      outer.classList.add("active");
    }
    function hideErrorMsg() {
      msg.textContent = "";
      outer.classList.remove("active");
    }

    return { element: outer, showErrorMsg };
  }
}
