export const getCanvasApiBaseUrl = () => {
  return process.env.CANVAS_DOMAIN + "/api/v1";
};

export const getCanvasApiToken = () => {
  return process.env.CANVAS_ACCESS_TOKEN;
};
