import { useEffect } from "react";
import { nexonClient } from "./api/nexonClient";

function App() {
  useEffect(() => {
    nexonClient
      .get("/id", { params: { nickname: "두마리치킨" } })
      .then((res) => console.log("성공", res.data))
      .catch((err) => console.error("에러발생", err));
  }, []);

  return <>Hi</>;
}

export default App;
