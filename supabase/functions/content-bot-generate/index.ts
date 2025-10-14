import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, mediaType = 'image' } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error('Admin access required');
    }

    console.log('Generating content for prompt:', prompt);

    // Enhanced prompt for Aurum Vest context
    const enhancedPrompt = `Create a professional, modern, and visually appealing image for Aurum Vest, an automated cryptocurrency trading platform. ${prompt}. The image should convey profitability, automation, technology, and trust in cryptocurrency trading. Style: professional, modern, tech-focused, financial. High quality, 16:9 aspect ratio.`;

    // Generate image using Runware
    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      throw new Error('Runware API key not configured');
    }

    console.log('Calling Runware API...');
    const runwareResponse = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: 'authentication',
          apiKey: runwareApiKey,
        },
        {
          taskType: 'imageInference',
          taskUUID: crypto.randomUUID(),
          positivePrompt: enhancedPrompt,
          width: 1920,
          height: 1080,
          model: 'runware:100@1',
          numberResults: 1,
          outputFormat: 'WEBP',
          CFGScale: 1,
          scheduler: 'FlowMatchEulerDiscreteScheduler',
        }
      ]),
    });

    if (!runwareResponse.ok) {
      const errorText = await runwareResponse.text();
      console.error('Runware API error:', errorText);
      throw new Error(`Runware API error: ${runwareResponse.status}`);
    }

    const runwareData = await runwareResponse.json();
    console.log('Runware response:', JSON.stringify(runwareData));

    if (!runwareData.data || runwareData.data.length === 0) {
      throw new Error('No image generated');
    }

    const imageData = runwareData.data.find((item: any) => item.taskType === 'imageInference');
    if (!imageData || !imageData.imageURL) {
      throw new Error('Invalid response from Runware');
    }

    // Download the image
    console.log('Downloading generated image...');
    const imageResponse = await fetch(imageData.imageURL);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Upload to Supabase storage
    const fileName = `${crypto.randomUUID()}.webp`;
    const storagePath = `generated/${fileName}`;

    console.log('Uploading to Supabase storage...');
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('content-bot-media')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('content-bot-media')
      .getPublicUrl(storagePath);

    // Save to database
    const { data: contentData, error: contentError } = await supabase
      .from('contents_bot')
      .insert({
        user_id: user.id,
        prompt: prompt,
        media_type: mediaType,
        media_url: publicUrl,
        storage_path: storagePath,
        provider: 'runware',
        metadata: {
          seed: imageData.seed,
          model: 'runware:100@1',
          dimensions: { width: 1920, height: 1080 },
        },
      })
      .select()
      .single();

    if (contentError) {
      console.error('Database insert error:', contentError);
      throw new Error(`Failed to save content: ${contentError.message}`);
    }

    console.log('Content generated successfully:', contentData.id);

    return new Response(
      JSON.stringify({
        success: true,
        content: contentData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content-bot-generate:', error);
    
    // Enhanced error messages
    let errorMessage = 'Failed to generate image';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Admin access')) {
        errorMessage = 'Admin access required';
        statusCode = 403;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        statusCode = 429;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        statusCode = 503;
      } else if (error.message.includes('Runware')) {
        errorMessage = `Image generation service error: ${error.message}`;
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});