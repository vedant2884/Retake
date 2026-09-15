import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export function CreatorTools({
  challengeId,
  showSelect,
}: {
  challengeId: string;
  showSelect: boolean;
}) {
  return (
    <div className="mt-xl border-t border-graphite-800 pt-lg">
      <p className="text-xs font-medium tracking-wide text-graphite-400">Creator tools</p>
      <div className="mt-sm flex flex-wrap gap-sm">
        {showSelect && (
          <Link
            href={`/creator/${challengeId}/select`}
            target="_blank"
            className={buttonStyles("secondary", "text-sm")}
          >
            Fullscreen selector
          </Link>
        )}
        <Link
          href={`/creator/${challengeId}/overlay`}
          target="_blank"
          className={buttonStyles("ghost", "text-sm")}
        >
          Open progress overlay
        </Link>
      </div>
      <p className="mt-sm text-xs text-graphite-400">
        Add the overlay link as an OBS Browser Source to show progress on
        stream.
      </p>
    </div>
  );
}
