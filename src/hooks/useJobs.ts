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

const PYTHON_API_URL = "http://localhost:8000/api/search-jobs";

async function fetchJobsFromApi(filters: JobFilters): Promise<Job[]> {
  console.log('Fetching jobs with filters (Python):', filters);

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
    console.log('Jobs received from Python API:', data?.jobs?.length || 0);
    return data?.jobs || [];
  } catch (err: any) {
    console.error('Failed to fetch jobs from Python API:', err);

    // Se a chave não estiver configurada no backend
    if (err.message.includes('SERPAPI_KEY')) {
      throw err;
    }

    // Se o servidor Python estiver offline
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error("O servidor Python (backend) não está rodando na porta 8000.");
    }

    // Fallback to mock data with filtering for other network issues
    console.warn('Falling back to mock data');
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
