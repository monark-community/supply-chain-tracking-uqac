"use client";

import { useEffect } from "react";
import { wakeBackend } from "@/lib/wakeBackend";

export default function WakeBackend() {
  useEffect(() => {
    void wakeBackend();
  }, []);

  return null;
}
