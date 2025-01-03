import { useEffect, useState } from "react";
import { Chip } from "./chip";

export function VersionChip() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    setVersion(window.ENV.VERSION_NAME ?? null);
  }, []);
  

  return <Chip>{version}</Chip>;
}
