import { useState } from "react";

const useUpdate = () => {
  const [_, setState] = useState<Object>({});
  return () => setState({});
};

export default useUpdate;
