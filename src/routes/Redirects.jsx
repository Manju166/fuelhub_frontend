import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Redirects() {
  const history = useNavigate();
  const [count, setCount] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 500);
    count === 0 && history("/");
    return () => clearInterval(interval);
  });
  return (
    <div>
      <p>403-Unauthorized</p>
      <p>You are unauthorized. Please Login first.</p>
      <p>
        Redirecting in -<span>{count}</span>
      </p>
    </div>
  );
}

export default Redirects;
