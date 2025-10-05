import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface QueryRequest {
  query: string;
  language?: string;
}

async function callCloudflareAI(query: string, context: string): Promise<string> {
  const cloudflareAccountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
  const cloudflareApiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');

  if (!cloudflareAccountId || !cloudflareApiToken) {
    console.log('Cloudflare AI not configured, falling back to keyword matching');
    return '';
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a compassionate crisis guidance assistant helping people in immigration and government-related emergencies. Available crisis categories: ice_detention, deportation, visa_issues, government_shutdown, work_authorization, asylum.

Context about available scenarios:
${context}

Analyze the user's query and:
1. Identify which crisis category best matches (return one: ice_detention, deportation, visa_issues, government_shutdown, work_authorization, asylum, or "none")
2. Provide a brief, empathetic response (2-3 sentences max)

Format your response as JSON: {"category": "category_name", "message": "your response"}`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 256,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare AI error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.result?.response || '';

    try {
      const jsonMatch = aiResponse.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return JSON.stringify(parsed);
      }
    } catch (e) {
      console.error('Failed to parse AI response', e);
    }

    return '';
  } catch (error) {
    console.error('Cloudflare AI call failed:', error);
    return '';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { query, language = 'en' }: QueryRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: allScenarios } = await supabase
      .from('crisis_scenarios')
      .select('*');

    const scenarioContext = allScenarios
      ?.map(s => `${s.category}: ${s.title} - ${s.description}`)
      .join('\n') || '';

    let matchedCategory = null;
    let aiMessage = '';

    const aiResponse = await callCloudflareAI(query, scenarioContext);

    if (aiResponse) {
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.category && parsed.category !== 'none') {
          matchedCategory = parsed.category;
          aiMessage = parsed.message;
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }
    }

    if (!matchedCategory) {
      const lowerQuery = query.toLowerCase();
      const keywords = {
        ice_detention: ['ice', 'detained', 'detention', 'arrested', 'taken', 'custody', 'immigration officer'],
        deportation: ['deport', 'deportation', 'removal', 'nta', 'notice to appear', 'immigration court'],
        visa_issues: ['visa', 'expire', 'expiring', 'extension', 'renew', 'status', 'h1b', 'f1', 'tourist'],
        government_shutdown: ['shutdown', 'furlough', 'federal employee', 'government worker', 'laid off', 'unpaid'],
        work_authorization: ['work permit', 'ead', 'work authorization', 'employment authorization', 'cannot work'],
        asylum: ['asylum', 'refugee', 'persecution', 'fear', 'home country', 'political', 'protection']
      };

      let maxMatches = 0;
      for (const [category, terms] of Object.entries(keywords)) {
        const matches = terms.filter(term => lowerQuery.includes(term)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          matchedCategory = category;
        }
      }
    }

    if (!matchedCategory) {
      const { data: scenarios } = await supabase
        .from('crisis_scenarios')
        .select('*')
        .order('severity', { ascending: false })
        .limit(3);

      return new Response(
        JSON.stringify({
          response: aiMessage || "I can help you with various immigration and crisis situations. Here are some common scenarios I can assist with:",
          suggestions: scenarios || [],
          matched: false,
          ai_powered: !!aiMessage
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: scenario } = await supabase
      .from('crisis_scenarios')
      .select('*')
      .eq('category', matchedCategory)
      .maybeSingle();

    if (!scenario) {
      return new Response(
        JSON.stringify({ error: 'No matching scenario found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const [stepsResult, resourcesResult] = await Promise.all([
      supabase
        .from('guidance_steps')
        .select('*')
        .eq('scenario_id', scenario.id)
        .order('step_number', { ascending: true }),
      supabase
        .from('resources')
        .select('*')
        .contains('categories', [matchedCategory])
        .limit(3)
    ]);

    const urgentSteps = stepsResult.data?.filter(step => step.is_urgent) || [];
    const emergencyResources = resourcesResult.data?.filter(r => r.is_emergency) || [];

    let responseText = aiMessage
      ? `${aiMessage}\n\n`
      : `Based on your query, I found guidance for: ${scenario.title}.\n\n`;

    if (urgentSteps.length > 0) {
      responseText += 'URGENT STEPS:\n';
      urgentSteps.forEach((step, idx) => {
        responseText += `${idx + 1}. ${step.title}\n`;
      });
      responseText += '\n';
    }

    if (emergencyResources.length > 0) {
      responseText += 'EMERGENCY CONTACTS:\n';
      emergencyResources.forEach(resource => {
        responseText += `• ${resource.name}`;
        if (resource.phone_number) {
          responseText += ` - ${resource.phone_number}`;
        }
        responseText += '\n';
      });
    }

    return new Response(
      JSON.stringify({
        response: responseText,
        scenario,
        steps: stepsResult.data || [],
        resources: resourcesResult.data || [],
        matched: true,
        category: matchedCategory,
        ai_powered: !!aiMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing query:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});