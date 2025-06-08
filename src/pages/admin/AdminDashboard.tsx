import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import {
  getAdminPlayers,
  adminUpdatePlayer,
  adminDeletePlayer,
  adminAddPlayer,
  replaceAdminPlayersWithPlayers,
  replacePlayersWithAdminPlayers,
} from "../../api";
import { getQuipRatingRounded, getRatingStyle } from "../../util";
import type { Player } from "../../types";

interface PlayerFormData {
  username: string;
  rating: number;
  notes?: string;
}

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [formData, setFormData] = useState<PlayerFormData>({
    username: "",
    rating: 0,
  });

  const queryClient = useQueryClient();

  const players = useQuery({
    queryKey: ["adminPlayers"],
    queryFn: getAdminPlayers,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000, // 1 second
  });

  // Mutations
  const updatePlayerMutation = useMutation({
    mutationFn: adminUpdatePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
      setIsEditModalOpen(false);
      setSelectedPlayer(null);
    },
    onError: (error) => {
      console.error("Error updating player:", error);
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: adminDeletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
      setIsDeleteModalOpen(false);
      setSelectedPlayer(null);
    },
    onError: (error) => {
      console.error("Error deleting player:", error);
    },
  });

  const addPlayerMutation = useMutation({
    mutationFn: adminAddPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
      setIsAddModalOpen(false);
      setFormData({ username: "", rating: 0, notes: "" });
    },
    onError: (error) => {
      console.error("Error adding player:", error);
    },
  });

  const releaseChangesMutation = useMutation({
    mutationFn: () => {
      console.log("Release changes mutation called");
      return replacePlayersWithAdminPlayers();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
      setIsReleaseModalOpen(false);
    },
    onError: (error) => {
      console.error("Error releasing changes:", error);
    },
  });

  const clearChangesMutation = useMutation({
    mutationFn: () => {
      console.log("Clear changes mutation called");
      return replaceAdminPlayersWithPlayers();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
      setIsClearModalOpen(false);
    },
    onError: (error) => {
      console.error("Error clearing changes:", error);
    },
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

  // Event handlers
  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setFormData({
      username: player.username,
      rating: player.rating || 0,
      notes: player.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (player: Player) => {
    setSelectedPlayer(player);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ username: "", rating: 0 });
    setIsAddModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["adminPlayers"] });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer) {
      updatePlayerMutation.mutate({
        ...selectedPlayer,
        username: formData.username,
        rating: formData.rating,
        notes: formData.notes,
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlayerMutation.mutate({
      username: formData.username,
      rating: formData.rating,
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedPlayer?.id) {
      deletePlayerMutation.mutate(selectedPlayer.id);
    }
  };

  const handleReleaseChanges = () => {
    setIsReleaseModalOpen(true);
  };

  const handleClearChanges = () => {
    setIsClearModalOpen(true);
  };

  const handleReleaseConfirm = () => {
    releaseChangesMutation.mutate();
    return (
      <div className="text-center py-8">
        <div className="text-xl">Loading players...</div>
      </div>
    );
  };

  const handleClearConfirm = () => {
    clearChangesMutation.mutate();
    return (
      <div className="text-center py-8">
        <div className="text-xl">Loading players...</div>
      </div>
    );
  };

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
      <div className="card card-lg forced-color-adjust-none bg-neutral text-neutral-content shadow-xl m-4">
        <div className="card-body">
          <div className="card-title">Players</div>
          <div className="card-actions">
            <button className="btn btn-primary btn-soft" onClick={handleAdd}>
              Add
            </button>
            <button
              className="btn btn-accent btn-soft"
              onClick={handleRefresh}
              disabled={players.isFetching}
            >
              {players.isFetching ? "Refreshing..." : "Refresh"}
            </button>
            <input
              className="input"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[300px]">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Username</th>
                  <th>Real Rating</th>
                  <th>Quip Rating</th>
                  <th>Notes</th>
                  <th>Modify</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPlayers.map((player, index) => (
                  <tr key={player.username}>
                    <th>{index + 1}</th>
                    <td>{player.username}</td>
                    <td>
                      <div
                        className="badge badge-lg badge-outline"
                        style={{
                          minWidth: "60px",
                        }}
                      >
                        {player.rating}
                      </div>
                    </td>
                    <td>
                      <div
                        className="badge badge-lg badge-outline"
                        style={{
                          minWidth: "60px",
                          background: player.rating
                            ? getRatingStyle(player.rating).background
                            : "transparent",
                          color: player.rating
                            ? getRatingStyle(player.rating).color
                            : "inherit",
                          borderColor: player.rating
                            ? getRatingStyle(player.rating).borderColor
                            : "inherit",
                        }}
                      >
                        {getQuipRatingRounded(player.rating) || "0.00"}
                      </div>
                    </td>
                    <td>{player.notes || "No notes"}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-soft"
                        onClick={() => handleEdit(player)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-soft ml-2"
                        onClick={() => handleDelete(player)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      {player.updated_at
                        ? new Date(player.updated_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card card-lg forced-color-adjust-none bg-neutral text-neutral-content shadow-xl m-4">
        <div className="card-body">
          <div className="card-title">Changes to be released</div>
          <div className="card-actions">
            <button
              className="btn btn-primary btn-soft"
              onClick={handleReleaseChanges}
            >
              Release new changes
            </button>
            <button
              className="btn btn-error btn-outline"
              onClick={handleClearChanges}
            >
              Clear all changes
            </button>
          </div>
          <div>Patch notes:</div>
          <div className="badge">Coming soon..</div>
        </div>
      </div>

      {/* Edit Player Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Player</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="py-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Rating</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input input-bordered w-full"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updatePlayerMutation.isPending}
              >
                {updatePlayerMutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsEditModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Add Player Modal */}
      <dialog className={`modal ${isAddModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Player</h3>
          <form onSubmit={handleAddSubmit}>
            <div className="py-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Rating</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input input-bordered w-full"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addPlayerMutation.isPending}
              >
                {addPlayerMutation.isPending ? "Adding..." : "Add Player"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsAddModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete player "{selectedPlayer?.username}"?
            This action cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteConfirm}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
      <dialog className={`modal ${isReleaseModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Release Changes</h3>
          <p className="py-4">
            Are you sure you want to release all changes? This will replace the
            main player data with the admin changes and cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setIsReleaseModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleReleaseConfirm}
              disabled={releaseChangesMutation.isPending}
            >
              {releaseChangesMutation.isPending
                ? "Releasing..."
                : "Release Changes"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsReleaseModalOpen(false)}>close</button>
        </form>
      </dialog>
      <dialog className={`modal ${isClearModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Clear All Changes</h3>
          <p className="py-4">
            Are you sure you want to clear all admin changes? This will reset
            the admin data to match the main player data and cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleClearConfirm}
              disabled={clearChangesMutation.isPending}
            >
              {clearChangesMutation.isPending ? "Clearing..." : "Clear Changes"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsClearModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default AdminDashboard;
