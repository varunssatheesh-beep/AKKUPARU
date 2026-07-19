// Cloudflare Pages Function: /api/rsvp
// Handles POST requests to save guest RSVPs in D1 Database.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle GET requests (retrieve live RSVP progress stats)
export async function onRequestGet(context) {
  const { env } = context;

  if (!env.DB) {
    // Fallback if D1 is not bound
    return new Response(JSON.stringify({
      totalRsvps: 12,
      totalGuests: 34,
      targetCapacity: 250,
      percentage: 14
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Proactive table auto-creation
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        attendees INTEGER,
        events TEXT,
        food TEXT,
        created_at TEXT NOT NULL
      )`
    ).run();

    const stats = await env.DB.prepare(
      `SELECT COUNT(*) as total_rsvps, COALESCE(SUM(attendees), 0) as total_guests FROM rsvps`
    ).first();

    const totalRsvps = stats?.total_rsvps || 0;
    const totalGuests = stats?.total_guests || 0;
    const targetCapacity = 250;
    const percentage = Math.min(Math.round((totalGuests / targetCapacity) * 100), 100);

    return new Response(JSON.stringify({
      totalRsvps,
      totalGuests,
      targetCapacity,
      percentage
    }), {
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
    // Proactive table auto-creation
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        attendees INTEGER,
        events TEXT,
        food TEXT,
        created_at TEXT NOT NULL
      )`
    ).run();

    const data = await request.json();
    const { name, phone, attendees, events, food } = data;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is a required field." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      "INSERT INTO rsvps (name, phone, attendees, events, food, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      name,
      phone || "",
      attendees ? parseInt(attendees) : 1,
      events || "Both",
      food || "Veg",
      createdAt
    ).run();

    return new Response(JSON.stringify({ success: true }), {
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
