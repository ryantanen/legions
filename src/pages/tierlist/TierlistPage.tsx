import { useQuery } from "@tanstack/react-query";
import { getPlayers } from "../../api.ts";
import type { Player } from "../../types.ts";
import { Link } from "react-router";

function TierlistPage() {
  const players = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  // Helper function to group players by tier
  const groupPlayersByTier = (playersData: Player[] | undefined) => {
    if (!playersData) return {};

    const tierGroups: Record<number, Player[]> = {};

    playersData.forEach((player: Player) => {
      const exactRating = player.rating || 0;
      const displayTier = Math.floor(exactRating * 10) / 10; // Round to 1 decimal place for display

      if (!tierGroups[displayTier]) {
        tierGroups[displayTier] = [];
      }
      tierGroups[displayTier].push(player);
    });

    Object.keys(tierGroups).forEach((tier) => {
      tierGroups[parseFloat(tier)].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    });

    return tierGroups;
  };

  if (players.isLoading) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-xl">Loading players...</div>
      </div>
    );
  }

  if (players.isError) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-xl text-red-500">
          Error loading players: {players.error?.message}
        </div>
      </div>
    );
  }

  const tierGroups = groupPlayersByTier(players.data);
  const sortedTiers = Object.keys(tierGroups)
    .map((tier) => parseFloat(tier))
    .sort((a, b) => b - a); // Sort in descending order (highest tier first)

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold text-center my-8">Quipeconomy List</h1>

      {sortedTiers.length === 0 ? (
        <div className="text-center py-8 text-xl text-gray-500">
          No players found
        </div>
      ) : (
        sortedTiers.map((tier) => {
          const tiersPlayers = tierGroups[tier];

          return (
            <div key={tier} className="flex flex-row gap-2 mb-2">
              <div
                className="px-10 py-5 text-center rounded-l"
                style={{
                  backgroundColor: `hsl(${
                    parseFloat(tier.toFixed(1)) * 120
                  }, 70%, 50%)`,
                  borderColor: `hsl(${
                    parseFloat(tier.toFixed(1)) * 120
                  }, 70%, 40%)`,
                  width: "200px",
                }}
              >
                <h2 className="text-2xl font-bold w-[100px]">
                  {tier.toFixed(1)}
                </h2>
              </div>
              <div className="flex flex-1 gap-1 items-center py-2 flex-wrap">
                {tiersPlayers.map((player, index) => (
                  <Link
                    to={`/players/${player.username}`}
                    key={player.id || index}
                    className="badge badge-soft badge-lg"
                  >
                    {player.username || `Player ${index + 1}`}
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default TierlistPage;
