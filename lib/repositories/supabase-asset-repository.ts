import { createClient } from "@supabase/supabase-js";
import type { Asset, AssetCategory } from "@/types/asset";
import type { IAssetRepository, AssetFilters } from "./asset-repository";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export class SupabaseAssetRepository implements IAssetRepository {
  async getAll(filters?: AssetFilters): Promise<Asset[]> {
    const sb = getClient();
    let q = sb.from("assets").select("*").eq("is_published", true);

    if (filters?.category) q = q.eq("category", filters.category);
    if (filters?.featured) q = q.eq("is_featured", true);
    if (filters?.search) {
      const term = `%${filters.search}%`;
      q = q.or(`title.ilike.${term},short_description.ilike.${term}`);
    }

    q = q.order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) throw new Error(`getAll failed: ${error.message}`);
    return data ?? [];
  }

  async getAllAdmin(): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getAllAdmin failed: ${error.message}`);
    return data ?? [];
  }

  async getBySlug(slug: string): Promise<Asset | null> {
    const sb = getClient();
    const { data } = await sb
      .from("assets")
      .select("*")
      .eq("slug", slug)
      .single();
    return data ?? null;
  }

  async getById(id: string): Promise<Asset | null> {
    const sb = getClient();
    const { data } = await sb
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();
    return data ?? null;
  }

  async getFeatured(): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getFeatured failed: ${error.message}`);
    return data ?? [];
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getByCategory failed: ${error.message}`);
    return data ?? [];
  }

  async create(data: Omit<Asset, "id" | "created_at">): Promise<Asset> {
    const sb = getClient();
    const { data: created, error } = await sb
      .from("assets")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(`create failed: ${error.message}`);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Asset, "id" | "created_at">>
  ): Promise<Asset> {
    const sb = getClient();
    const { data: updated, error } = await sb
      .from("assets")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`update failed: ${error.message}`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const sb = getClient();
    const { error } = await sb.from("assets").delete().eq("id", id);
    if (error) throw new Error(`delete failed: ${error.message}`);
  }
}
