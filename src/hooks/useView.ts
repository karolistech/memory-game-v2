import { useState } from "react";

import type { View } from "@/types/view";

export function useView() {
  const [view, setView] = useState<View>("editor");

  return { view, setView };
}
