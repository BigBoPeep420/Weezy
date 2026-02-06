import { Weezy } from "./modules/weezy.js";
import { emmet } from "emmet-elem";
import { default as viewHome } from "@/views/home.js";

const weezy = await Weezy();
const content = emmet(`section#content`);
content.appendChild();
