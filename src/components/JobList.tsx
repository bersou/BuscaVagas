import { Briefcase, Frown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { JobCard } from './JobCard';
import { Job } from '@/lib/mockJobs';
import { Button } from '@/components/ui/button';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error?: Error | null;
  favorites: Job[];
  onToggleFavorite: (job: Job) => void;
  showingFavorites: boolean;
  onRetry?: () => void;
}

function JobSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card animate-pulse">
      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-xl bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobList({ jobs, isLoading, error, favorites, onToggleFavorite, showingFavorites, onRetry }: JobListProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 py-12 px-4 text-center"
      >
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Erro na busca</h3>
        <p className="max-w-sm text-sm text-muted-foreground mb-6">
          {error.message.includes('API key') || error.message.includes('not configured')
            ? "A chave da API SerpApi não está configurada corretamente no arquivo .env. Por favor, adicione a variável SERPAPI_KEY."
            : error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
              ? "Não foi possível conectar ao servidor Python. Verifique se o executou com 'python backend/main.py'."
              : error.message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Buscando vagas...</span>
        </div>
        {[...Array(5)].map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 px-4 text-center"
      >
        <div className="mb-4 rounded-full bg-muted p-4">
          {showingFavorites ? (
            <Frown className="h-8 w-8 text-muted-foreground" />
          ) : (
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {showingFavorites ? 'Nenhum favorito ainda' : 'Nenhuma vaga encontrada'}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {showingFavorites
            ? 'Adicione vagas aos favoritos clicando no ícone de coração para visualizá-las aqui.'
            : 'Tente ajustar os filtros ou usar termos de busca diferentes para encontrar mais oportunidades.'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{jobs.length}</span>{' '}
          {showingFavorites ? 'vaga(s) favoritada(s)' : 'vaga(s) encontrada(s)'}
        </p>
      </div>

      <motion.div layout className="space-y-4">
        {jobs.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            isFavorite={favorites.some((f) => f.id === job.id)}
            onToggleFavorite={onToggleFavorite}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}
