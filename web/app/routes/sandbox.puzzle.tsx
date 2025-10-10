import { Puzzle } from "~/features/puzzle/components/Puzzle";

export default function PuzzlePage() {
  return (
    <div className="min-h-full flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Puzzle</h1>
      <div className="flex-1 flex justify-center items-center">
        <Puzzle />
      </div>
    </div>
  );
}
