import { Routes, Route } from "react-router-dom";
import { Home, V1, V2, V3, V4, V5, V6 } from "../pages";

const Web = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/v1" element={<V1 />} />
            <Route path="/v2" element={<V2 />} />
            <Route path="/v3" element={<V3 />} />
            <Route path="/v4" element={<V4 />} />
            <Route path="/v5" element={<V5 />} />
            <Route path="/v6" element={<V6 />} />
        </Routes>
    );
};

export default Web;