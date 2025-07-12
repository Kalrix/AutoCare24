import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tuzrkjshdwatdokdpvxz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1enJranNoZHdhdGRva2Rwdnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTkxODEsImV4cCI6MjA2Nzc5NTE4MX0.jxN7I0dX_QgwBrNcPA9DbJTBMF_IC1U81xg2u40tRhk"
);

async function run() {
  const { data, error } = await supabase
    .from("carwash")
    .select("time")
    .eq("date", "2025-07-13")
    .eq("store_id", "e8e49760-66a3-441b-8c53-7e3350dc5c61");

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

run();
