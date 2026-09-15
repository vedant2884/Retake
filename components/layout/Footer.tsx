import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-graphite-800 py-lg">
      <Container className="flex flex-col gap-2 text-xs text-graphite-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Not affiliated with Riot Games.</p>
        <p>Built for players and creators.</p>
      </Container>
    </footer>
  );
}
