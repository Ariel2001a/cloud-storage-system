import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftSizeBar from "../components/left_side_bar.jsx";
import UpSideBar from "../components/up_side_bar.jsx";

export default function HomePage() {
    
    return (
        <div>
            <UpSideBar />
            <LeftSizeBar />
        </div>
    );
}