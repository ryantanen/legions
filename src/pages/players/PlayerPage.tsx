import { Link, useNavigate, useParams } from "react-router";
import type { Player } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getPlayerByName } from "../../api";
import { getQuipRatingRounded, getRatingStyle } from "../../util";

function PlayerPage() {
  const playerUsername = useParams<{ playerUsername: string }>().playerUsername;
  const navigate = useNavigate();
  if (!playerUsername) {
    navigate("/players", { replace: true });
  }
  const player = useQuery({
    queryKey: ["player", playerUsername],
    queryFn: playerUsername
      ? getPlayerByName.bind(null, playerUsername)
      : undefined,
    enabled: !!playerUsername, // Ensure the query only runs if playerUsername is defined
  }).data as Player | undefined;

  if (!player) {
    navigate("/players", { replace: true });
  }

  return player ? (
    <div className="w-full">
      <Link to={"/players"} className="m-4 btn btn-soft btn-secondary relative">
        Back
      </Link>

      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-row">
          <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-2">{player.username}</h1>
            <div
              className="badge badge-lg badge-outline"
              style={{
                minWidth: "60px",
                background: getRatingStyle(player.rating).background,
                color: getRatingStyle(player.rating).color,
                borderColor: getRatingStyle(player.rating).borderColor,
              }}
            >
              {getQuipRatingRounded(player.rating) || "0.00"}
            </div>
          </div>
          {/* <div className="p-4">
          <h2 className="text-xl font-semibold">Player Details</h2>
          <p>Username: {player.username}</p>
          <p>Rating: {(Math.floor(player.rating * 10) / 10.0).toFixed(1)}</p>

        </div> */}
        </div>
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold">Player Notes</h2>
          <p className="text-primary">{player.notes || "No notes available"}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">Player Stats</h2>
          <div className="badge badge-xl badge-soft badge-primary">
            Coming soon
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default PlayerPage;
