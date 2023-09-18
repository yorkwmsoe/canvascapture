import gradient from "gradient-string";
import figlet from "figlet";
import { theme } from "@constants/theme";

export function printTitle() {
  const titleGradient = gradient(Object.values(theme));
  console.log(
    titleGradient.multiline(
      figlet.textSync("Canvas Capture", { font: "Standard" })
    )
  );
}

export const convertTwoArraysToObject = <T, U>(
  array1: T[],
  array2: U[]
): Record<string, U> => {
  const map = new Map<T, U>();
  array1.forEach((value, index) => {
    map.set(value, array2[index]);
  });
  return Object.fromEntries(map);
};
