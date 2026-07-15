// Cloudflare Pages Function: /api/blessings
// Handles GET and POST requests to query/store blessings in D1 Database.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

// Handle OPTIONS requests (preflight)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle GET requests (retrieve all blessings)
export async function onRequestGet(context) {
  const { env } = context;

  // Check if D1 database binding exists
  if (!env.DB) {
    return new Response(JSON.stringify({
      error: "D1 database binding 'DB' not found. Please bind it in your Cloudflare Pages dashboard.",
      blessings: [
        {
          id: 1,
          name: "Adv. Satheesh Kumar S & Mrs. Smitha S Nair",
          relation: "Parents of the Bride",
          message: "Wishing our dearest children Varsha and Akhil a beautiful journey ahead. May God shower you with endless happiness. 🪷",
          created_at: new Date().toISOString()
        }
      ]
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Query D1 SQL database
    const { results } = await env.DB.prepare(
      "SELECT * FROM blessings ORDER BY id DESC"
    ).all();

    return new Response(JSON.stringify({ blessings: results }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Handle POST requests (submit a new blessing)
export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({
      error: "D1 database binding 'DB' not found. Please bind it in your Cloudflare Pages dashboard."
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const data = await request.json();
    const { name, relation, message } = data;

    if (!name || !message) {
      return new Response(JSON.stringify({ error: "Name and message are required fields." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const createdAt = new Date().toISOString();

    // Insert into D1 SQL database
    const info = await env.DB.prepare(
      "INSERT INTO blessings (name, relation, message, created_at) VALUES (?, ?, ?, ?)"
    ).bind(name, relation || "", message, createdAt).run();

    return new Response(JSON.stringify({
      success: true,
      blessing: {
        id: info.meta?.last_row_id || Date.now(),
        name,
        relation,
        message,
        created_at: createdAt
      }
    }), {
      status: 201,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
