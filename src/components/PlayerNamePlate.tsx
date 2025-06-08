import { Link } from "react-router";
import type { Player } from "../types";
import { getRatingStyle, getQuipRatingRounded } from "../util";

function PlayerNamePlate({
  player,
  hideRating = false,
}: {
  player: Player;
  hideRating?: boolean;
}) {
  const ratingStyle = getRatingStyle(player.rating);

  return (
    <Link
      to={"/players/" + player.username}
      className="btn btn-ghost flex flex-row items-center justify-center gap-2 p-2"
    >
      <div className="text-base md:text-lg font-medium">{player.username}</div>
      {!hideRating && (
        <div
          className="badge badge-lg badge-outline min-w-[30px] md:min-w-[60px]"
          style={{
            ...ratingStyle,
          }}
        >
          {getQuipRatingRounded(player.rating) || "0.0"}
        </div>
      )}
    </Link>
  );
}

export default PlayerNamePlate;
