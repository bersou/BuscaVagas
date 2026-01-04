import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockJobs, Job } from '@/lib/mockJobs';

export interface JobFilters {
  query: string;
  location: string;
}

const defaultFilters: JobFilters = {
  query: '',
  location: '',
};

/** * AJUSTE CRUCIAL: 
 * Agora o código tenta ler a variável VITE_API_URL que você configurou no Netlify.
 * Se ela não existir (como no seu PC), ele usa o localhost por padrão.
 */
const PYTHON_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/search-jobs";

async function fetchJobsFromApi(filters: JobFilters): Promise<Job[]> {
  // Log para você ver no console do navegador qual URL está sendo chamada
  console.log('Conectando em:', PYTHON_API_URL);

  try {
    const response = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: filters.query,
        location: filters.location,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Falha ao buscar vagas no servidor Python");
    }

    const data = await response.json();
    console.log('Vagas recebidas do Backend:', data?.jobs?.length || 0);
    return data?.jobs || [];
  } catch (err: any) {
    console.error('Erro na requisição:', err);

    // Se a chave não estiver configurada no backend
    if (err.message.includes('SERPAPI_KEY')) {
      throw err;
    }

    // Ajuste na mensagem de erro para ser mais inteligente
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      const isLocal = window.location.hostname === 'localhost';
      const errorMessage = isLocal 
        ? "O servidor Python (backend) não está rodando na porta 8000 localmente."
        : "Não foi possível conectar ao servidor de busca. O backend (Render) pode estar 'acordando'. Tente novamente em alguns segundos.";
      
      throw new Error(errorMessage);
    }

    // Fallback para dados mockados em caso de outros erros
    console.warn('Usando dados de teste devido a erro de conexão');
    return filterMockJobs(filters);
  }
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filterMockJobs(filters: JobFilters): Job[] {
  let filteredJobs = [...mockJobs];

  if (filters.query) {
    const query = normalize(filters.query);
    filteredJobs = filteredJobs.filter(job =>
      normalize(job.title).includes(query) ||
      normalize(job.company).includes(query) ||
      normalize(job.description).includes(query)
    );
  }

  if (filters.location) {
    const location = normalize(filters.location);
    filteredJobs = filteredJobs.filter(job =>
      normalize(job.location).includes(location)
    );
  }

  return filteredJobs;
}

export function useJobs(filters: JobFilters = defaultFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobsFromApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
}
