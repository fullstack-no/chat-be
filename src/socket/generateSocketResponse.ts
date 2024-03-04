export const socketOkResponse = (data?: any) => {
  return { status: true, data };
};

export const socketErrorResponse = (message: string = "") => {
  return { status: false, message };
};
