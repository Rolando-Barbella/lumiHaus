// Since we're using client-side state management, we'll generate paths for a reasonable range
export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}