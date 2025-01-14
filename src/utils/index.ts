const getFileExt = (filename: string) => {
  const ext = filename.split(".").pop();
  return ext ? ext : "";
};

export { getFileExt };
