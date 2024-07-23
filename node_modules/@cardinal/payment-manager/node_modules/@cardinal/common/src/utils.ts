export const getQueryParam = (url: string, name: string) => {
  if (!url || !name) return null;
  const q = url.match(new RegExp("[?&]" + name + "=([^&#]*)"));
  return q && q[1];
};

export const firstParam = (param: string | string[] | undefined): string => {
  if (!param) return "";
  return typeof param === "string" ? param : param[0] || "";
};

export const camelCase = (str: string) => {
  return str
    .split(" ")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join("");
};

export const capitalizeFirstLetter = (value: string) => {
  return value[0] ? value[0].toUpperCase() + value.slice(1) : "";
};

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

export const withCluster = (s: string, cluster: string) => {
  return `${s}${
    cluster !== "mainnet-beta" && cluster !== "mainnet"
      ? `${s.includes("?") ? "&" : "?"}cluster=${cluster}`
      : ""
  }`;
};
