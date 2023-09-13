import gradient from "gradient-string";
import { theme } from "../constants/theme";
import figlet from "figlet";

export function printTitle() {
  const titleGradient = gradient(Object.values(theme));
  console.log(
    titleGradient.multiline(
      figlet.textSync("Canvas Capture", { font: "Standard" })
    )
  );
}
