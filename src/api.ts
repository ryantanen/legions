import { noop } from "@tanstack/react-query";
import { supabase } from "./main.tsx";
import type { Player } from "./types.ts";

export async function getPlayers(): Promise<Player[]> {
  const { data } = await supabase.from("players").select();
  console.log("Fetched players:", data);
  return data || [];
}
export async function checkAdminPermissions(): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_players")
    .select("id")
    .limit(1);
  if (error) {
    return false;
  }
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function getAdminPlayers(): Promise<Player[]> {
  const { data } = await supabase.from("admin_players").select();
  console.log("Fetched players:", data);
  return data || [];
}

export async function adminUpdatePlayer(
  player: Player
): Promise<Player | null> {
  const { data, error } = await supabase
    .from("admin_players")
    .update({
      username: player.username,
      rating: player.rating,
      notes: player.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", player.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating player:", error);
    throw error;
  }

  return data || null;
}

export async function adminDeletePlayer(playerId: string): Promise<boolean> {
  const { error } = await supabase
    .from("admin_players")
    .delete()
    .eq("id", playerId);
  if (error) {
    console.error("Error deleting player:", error);
    return false;
  }
  console.log("Player deleted successfully:", playerId);
  return true;
}

export async function adminAddPlayer(
  player: Omit<Player, "id" | "updated_at">
): Promise<Player | null> {
  const { data, error } = await supabase
    .from("admin_players")
    .insert(player)
    .select()
    .single();
  if (error) {
    console.error("Error adding player:", error);
    return null;
  }
  console.log("Player added successfully:", data);
  return data || null;
}

export async function getPlayerByName(
  username: string
): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching player by name:", error);
    return null;
  }

  console.log("Fetched player by name:", data);
  return data || null;
}

export async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: window.location.origin + "/admin",
    },
  });
  return { data, error };
}

export async function replaceAdminPlayersWithPlayers(): Promise<boolean> {
  const { error } = await supabase.rpc("replace_admin_players_with_players");

  if (error) {
    console.error("Error calling replace_admin_players_with_players:", error);
    return false;
  }

  console.log("Successfully replaced admin players with players");
  return true;
}

export async function replacePlayersWithAdminPlayers(): Promise<boolean> {
  const { error } = await supabase.rpc("replace_players_with_admin_players");

  if (error) {
    console.error("Error calling replace_players_with_admin_players:", error);
    return false;
  }

  console.log("Successfully replaced admin players with players");
  return true;
}
