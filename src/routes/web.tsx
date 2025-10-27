import { Routes, Route } from "react-router-dom";
import { V1 } from "../pages"

const Web = () => {
  return (
    <Routes>
      <Route path="/" element={<V1 />} />
    </Routes>
  );
};

export default Web;