export const prepareFileForUpload = (
  uri: string | undefined,
  defaultName: string
) => {
  if (!uri) return undefined;
  const filename = uri.split("/").pop() || defaultName;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return {
    uri,
    name: filename,
    type: type === "image/pdf" ? "application/pdf" : type,
  } as any;
};
