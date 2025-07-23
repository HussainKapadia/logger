"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then(setMessage)
      .catch(console.error);
  }, []);

  return (
    <main className="p-6 text-lg">
      <p>{message || "Loading..."}</p>
    </main>
  );
}
