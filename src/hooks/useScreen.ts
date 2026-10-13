import { useState } from "react";

import type { Screen } from "@/types/screen";

export function useScreen() {
  const [screen, setScreen] = useState<Screen>("main-menu");

  return { screen, setScreen };
}
