import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  query: string;
  location: string;
  types?: string[];
  modalities?: string[];
  levels?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');

    if (!SERPAPI_KEY) {
      console.error('SERPAPI_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured', jobs: [] }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const params: SearchParams = await req.json();
    console.log('Search params received:', params);

    // Build the search query for Google Jobs
    let searchQuery = params.query?.trim() || '';

    // If query is empty but location exists, search for "vagas [location]"
    // If both are empty, search for "vagas de emprego Brasil"
    if (!searchQuery) {
      if (params.location) {
        searchQuery = `vagas de emprego ${params.location}`;
      } else {
        searchQuery = "vagas de emprego Brasil";
      }
    } else if (params.location) {
      // If both exist, combine them
      searchQuery += ` ${params.location}`;
    }

    console.log('Original params:', params);
    console.log('Constructed search query:', searchQuery);
    // Add filters to query
    if (params.types && params.types.length > 0) {
      searchQuery += ` ${params.types.join(' ')}`;
    }

    if (params.modalities && params.modalities.length > 0) {
      const modalityMap: Record<string, string> = {
        'Remoto': 'remoto trabalho remoto',
        'Híbrido': 'híbrido',
        'Presencial': 'presencial'
      };
      const modalityTerms = params.modalities.map(m => modalityMap[m] || m).join(' ');
      searchQuery += ` ${modalityTerms}`;
    }

    if (params.levels && params.levels.length > 0) {
      searchQuery += ` ${params.levels.join(' ')}`;
    }

    console.log('Final search query:', searchQuery);

    // Call SerpApi Google Jobs API
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_jobs');
    serpApiUrl.searchParams.set('q', searchQuery);
    serpApiUrl.searchParams.set('hl', 'pt-br');
    serpApiUrl.searchParams.set('gl', 'br');

    // location_requested helps SerpApi with localized results
    if (params.location) {
      serpApiUrl.searchParams.set('location', params.location);
    }

    serpApiUrl.searchParams.set('api_key', SERPAPI_KEY);

    console.log('Calling SerpApi:', serpApiUrl.toString().replace(SERPAPI_KEY, '[REDACTED]'));

    const response = await fetch(serpApiUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SerpApi error:', response.status, errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch jobs from SerpApi',
          details: errorText,
          jobs: []
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('SerpApi response received, jobs count:', data.jobs_results?.length || 0);

    // Transform SerpApi results to our Job format
    const jobs = (data.jobs_results || []).map((job: any, index: number) => {
      // Try to determine job type from description
      let type = 'CLT';
      const descLower = (job.description || '').toLowerCase();
      if (descLower.includes('pj') || descLower.includes('pessoa jurídica')) {
        type = 'PJ';
      } else if (descLower.includes('estágio') || descLower.includes('estagiário')) {
        type = 'Estágio';
      } else if (descLower.includes('temporário')) {
        type = 'Temporário';
      }

      // Try to determine modality
      let modality = 'Presencial';
      if (descLower.includes('remoto') || descLower.includes('home office') || descLower.includes('trabalho remoto')) {
        modality = 'Remoto';
      } else if (descLower.includes('híbrido')) {
        modality = 'Híbrido';
      }

      // Try to determine level
      let level = 'Pleno';
      if (descLower.includes('júnior') || descLower.includes('junior') || descLower.includes('jr')) {
        level = 'Júnior';
      } else if (descLower.includes('sênior') || descLower.includes('senior') || descLower.includes('sr')) {
        level = 'Sênior';
      }

      // Extract salary if available
      const salaryMatch = (job.description || '').match(/R\$\s*[\d.,]+(?:\s*[-–a-zA-Z]+\s*R\$\s*[\d.,]+)?/i);
      const salary = salaryMatch ? salaryMatch[0] : undefined;

      // Determine source from via field
      const source = job.via || 'Google Jobs';

      // Check for badges
      const isUrgent = descLower.includes('urgente') || descLower.includes('imediato');
      const isSimplified = job.extensions?.includes('Candidatura simplificada') ||
        descLower.includes('candidatura simplificada') ||
        job.apply_options?.some((opt: any) => opt.is_direct);

      return {
        id: `serpapi-${index}-${Date.now()}`,
        title: job.title || 'Vaga sem título',
        company: job.company_name || 'Empresa não informada',
        companyLogo: job.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent((job.company_name || 'E').substring(0, 2))}&background=random`,
        location: job.location || 'Localização não informada',
        type,
        modality,
        level,
        salary,
        description: job.description || 'Descrição não disponível',
        requirements: job.job_highlights?.find((h: any) => h.title === 'Qualificações')?.items ||
          job.detected_extensions?.qualifications ||
          [],
        benefits: job.job_highlights?.find((h: any) => h.title === 'Benefícios')?.items || [],
        postedAt: job.detected_extensions?.posted_at || new Date().toISOString().split('T')[0],
        source: source.replace('via ', ''),
        applicationUrl: job.apply_options?.[0]?.link || job.share_link || '#',
        isUrgent,
        isFeatured: index < 3, // First 3 results as featured
        isSimplified
      };
    });

    console.log('Transformed jobs:', jobs.length);

    return new Response(
      JSON.stringify({
        jobs,
        search_metadata: data.search_metadata,
        total_results: jobs.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in search-jobs function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        jobs: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
