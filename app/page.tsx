import { HeroSection } from "@/components/home/hero-section";
import { PUBLICACION_LISTA_MS } from "@/data/publicacion-lista";
import { connection } from "next/server";

export default async function Home() {
  await connection();
  // Request-time clock read is required for the initial countdown value.
  // eslint-disable-next-line react-hooks/purity
  const initialRemainingSeconds = Math.max(0, Math.ceil((PUBLICACION_LISTA_MS - Date.now()) / 1000));
  return <HeroSection initialRemainingSeconds={initialRemainingSeconds} />;
}
