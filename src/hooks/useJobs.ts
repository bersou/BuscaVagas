import { useQuery } from '@tanstack/react-query';
import { mockJobs, Job } from '@/lib/mockJobs';

export interface JobFilters {
  query: string;
  location: string;
}

const defaultFilters: JobFilters = {
  query: '',
  location: '',
};

// Pega a URL configurada no Netlify. Se não houver, usa o localhost.
const PYTHON_API_URL = import.meta.env.VITE_API_URL || "https://buscavagas.onzender.com/api/search-jobs;";

async function fetchJobsFromApi(filters: JobFilters): Promise<Job[]> {
  console.log('Solicitando vagas reais para:', PYTHON_API_URL);

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
      throw new Error(errorData.detail || "Falha na resposta do servidor Python");
    }

    const data = await response.json();
    console.log('Sucesso! Vagas recebidas:', data?.jobs?.length || 0);
    return data?.jobs || [];

  } catch (err: any) {
    console.error('Erro na conexão:', err);

    // MODO DESENVOLVIMENTO: No seu PC, ele ainda mostra mocks se o servidor estiver desligado
    if (window.location.hostname === 'localhost') {
      console.warn('Ambiente Local: Usando dados de teste (Mock)');
      return filterMockJobs(filters);
    }

    // MODO PRODUÇÃO: No Netlify, ele lança um erro real para você saber se o backend falhou
    const errorMessage = err.message.includes('Failed to fetch') 
      ? "O servidor (Render) está ligando. Aguarde 30 segundos e tente novamente."
      : "Ocorreu um erro ao buscar as vagas reais.";
    
    throw new Error(errorMessage);
  }
}

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterMockJobs(filters: JobFilters): Job[] {
  let filteredJobs = [...mockJobs];
  if (filters.query) {
    const q = normalize(filters.query);
    filteredJobs = filteredJobs.filter(j => normalize(j.title).includes(q) || normalize(j.company).includes(q));
  }
  if (filters.location) {
    const l = normalize(filters.location);
    filteredJobs = filteredJobs.filter(j => normalize(j.location).includes(l));
  }
  return filteredJobs;
}

export function useJobs(filters: JobFilters = defaultFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobsFromApi(filters),
    staleTime: 5 * 60 * 1000, // Mantém os dados por 5 minutos
    retry: 1,                 // Tenta reconectar 1 vez antes de exibir erro
  });
}
