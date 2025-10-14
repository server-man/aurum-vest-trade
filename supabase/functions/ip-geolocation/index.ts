import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ip } = await req.json();

    if (!ip) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use ip-api.com free API (no key required, but has rate limits)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,timezone`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }

    const data = await response.json();

    if (data.status === 'fail') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          location: 'Unknown',
          country: 'Unknown',
          city: 'Unknown'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Geolocation fetched for IP ${ip}: ${data.city}, ${data.country}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        country: data.country,
        region: data.regionName,
        city: data.city,
        location: `${data.city}, ${data.country}`,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ip-geolocation function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        location: 'Unknown',
        country: 'Unknown',
        city: 'Unknown'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
