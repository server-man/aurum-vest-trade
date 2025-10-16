import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Upstash Redis REST API configuration
const UPSTASH_REDIS_REST_URL = Deno.env.get('UPSTASH_REDIS_REST_URL');
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

interface CacheRequest {
  action: 'get' | 'set' | 'delete' | 'exists';
  key: string;
  value?: any;
  ttl?: number; // Time to live in seconds
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Redis configuration missing');
    }

    const { action, key, value, ttl = 3600 }: CacheRequest = await req.json();

    if (!action || !key) {
      throw new Error('Missing required parameters: action and key');
    }

    let result;

    switch (action) {
      case 'get': {
        const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
          headers: {
            'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        const data = await response.json();
        result = data.result ? JSON.parse(data.result) : null;
        break;
      }

      case 'set': {
        if (value === undefined) {
          throw new Error('Value is required for set action');
        }
        
        const stringValue = JSON.stringify(value);
        const response = await fetch(`${UPSTASH_REDIS_REST_URL}/setex/${key}/${ttl}/${encodeURIComponent(stringValue)}`, {
          headers: {
            'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        const data = await response.json();
        result = { success: data.result === 'OK' };
        break;
      }

      case 'delete': {
        const response = await fetch(`${UPSTASH_REDIS_REST_URL}/del/${key}`, {
          headers: {
            'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        const data = await response.json();
        result = { deleted: data.result === 1 };
        break;
      }

      case 'exists': {
        const response = await fetch(`${UPSTASH_REDIS_REST_URL}/exists/${key}`, {
          headers: {
            'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        const data = await response.json();
        result = { exists: data.result === 1 };
        break;
      }

      default:
        throw new Error(`Invalid action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Redis cache error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
