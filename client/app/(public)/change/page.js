"use client";
import { useEffect } from "react";

export default function Change() {
  useEffect(() => {
    async function update() {
      const res = await fetch("http://localhost:3030/change");
      if (res.ok) console.log("OK to update password");
      else console.log("Fail to update password");
    }

    update();
  }, []);
  return <>Change PASSWORD</>;
}
