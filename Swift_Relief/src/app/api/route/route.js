// src/app/api/route/route.js

///////////////////////////////////////////////////////////////////////////
// This function runs when someone sends a GET request to this API endpoint
///////////////////////////////////////////////////////////////////////////

export async function GET(req) {
  try {
    /////////////////////////////////////////////////////////
    // Extract start and end coordinates from the request URL
    ////////////////////////////////////////////////////////
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start"); // Example: "85.123,20.456"
    const end = searchParams.get("end"); // Example: "85.654,20.789"

    ////////////////////////////////////////////////////////////////
    // If user does not provide both start and end → return an error
    ////////////////////////////////////////////////////////////////

    if (!start || !end) {
      return new Response(
        JSON.stringify({ error: "Start and End coordinates required" }),
        { status: 400 } // Bad request
      );
    }

    //////////////////////////////////////////////////////
    // ✅ First API call: Get directions from Start → End
    //////////////////////////////////////////////////////

    const forwardRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?start=${start}&end=${end}`,
      {
        ///////////////////////////////////////////////////////
        // Use your API key (stored in .env.local for security)
        ///////////////////////////////////////////////////////

        headers: { Authorization: process.env.OPENROUTESERVICE_API_KEY },
      }
    );

    //////////////////////////////////////
    // Convert the response to JSON format
    //////////////////////////////////////

    const forwardData = await forwardRes.json();

    ////////////////////////////////////////////////////////////////////
    // ✅ Second API call: Get directions from End → Start (return trip)
    ////////////////////////////////////////////////////////////////////

    const returnRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?start=${end}&end=${start}`,
      {
        headers: { Authorization: process.env.OPENROUTESERVICE_API_KEY },
      }
    );

    const returnData = await returnRes.json();

    ///////////////////////////////////////////
    // ✅ Combine both trips into one response
    //////////////////////////////////////////

    return new Response(
      JSON.stringify({
        forward: forwardData, // Trip 1: Start → End
        back: returnData, // Trip 2: End → Start
      }),
      { status: 200 } // Success
    );
  } catch (err) {
    ////////////////////////////////////////////////////////////////////
    // If anything goes wrong → log error and return 500 (server error)
    ////////////////////////////////////////////////////////////////////

    console.error("Route API error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
