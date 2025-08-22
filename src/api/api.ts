import { supabase } from "./supabaseClient";

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`;
const API_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const GetListService = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "count=exact", // ask for total row count
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `API Error: ${res.status} ${res.statusText} - ${errorData.message || ""}`
    );
  }

  const data = await res.json();
  const contentRange = res.headers.get("content-range"); // e.g. "0-9/25"
  const total = contentRange ? parseInt(contentRange.split("/")[1], 10) : null;

  return { data, total };
};

export const CreateCarInfoService = async (body) => {
  const { data, error } = await supabase.from("vehicles").insert([body]);

  if (error) {
    console.error("Supabase insert error:", error);
    throw error; // Hata fırlatalım ki yukarıda yakalayabilelim
  }

  return data;
};

export const UploadImageService = async (file, urlName, id) => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${id}/${fileName}`;

  const { data: publicUrlData } = supabase.storage
    .from(urlName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const GetVehicleImagesService = async (url, id) => {
  const { data, error } = await supabase.storage.from(url).list(id + "/", {
    limit: 5,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    console.error("Resimler listelenemedi:", error);
    return [];
  }

  return data.map((file) => {
    const { data: publicUrlData } = supabase.storage
      .from(url)
      .getPublicUrl(id + "/" + file.name);
    return publicUrlData.publicUrl;
  });
};
