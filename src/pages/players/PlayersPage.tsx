import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { getPlayers } from "../../api.ts";
import PlayerNamePlate from "../../components/PlayerNamePlate";

function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const players = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000, // 1 second
  });

  // Filter and sort players using Fuse.js
  const filteredAndSortedPlayers = useMemo(() => {
    if (!players.data) return [];

    const fuse = new Fuse(players.data, {
      keys: ["username"],
      threshold: 0.3, // Adjust for sensitivity
    });

    const filtered = searchTerm
      ? fuse.search(searchTerm).map((result) => result.item)
      : players.data;

    // Sort by rating in descending order (highest first)
    return filtered.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });
  }, [players.data, searchTerm]);

  if (players.isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl">Loading players...</div>
      </div>
    );
  }

  if (players.isError) {
    return (
      <div className="text-center py-8">
        <div className="text-xl text-red-500">
          Error loading players: {players.error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold text-center my-8">All Players</h1>
      <div className="flex justify-center mb-4">
        <label className="input w-1/2">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Show search results count */}
      {searchTerm && (
        <div className="text-center mb-4 text-gray-600">
          {filteredAndSortedPlayers.length} player
          {filteredAndSortedPlayers.length !== 1 ? "s" : ""} found
        </div>
      )}

      <div className="flex flex-wrap items-center justify-evenly md:justify-center gap-2">
        {filteredAndSortedPlayers.length === 0 ? (
          <div className="text-center py-8 text-xl text-gray-500">
            {searchTerm ? "No players match your search" : "No players found"}
          </div>
        ) : (
          filteredAndSortedPlayers.map((player) => (
            <PlayerNamePlate
              key={player.id}
              player={{
                username: player.username || "Unknown Player",
                rating: player.rating || 0,
                id: player.id,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PlayersPage;
