import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchHero } from '@/components/SearchHero';
import { JobList } from '@/components/JobList';
import { useJobs } from '@/hooks/useJobs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Job } from '@/lib/mockJobs';
import { mockJobs } from '@/lib/mockJobs';

const Index = () => {
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<Job[]>('job-favorites', []);
  const [filters, setFilters] = useState({
    query: '',
    location: '',
  });

  const { data: jobs = [], isLoading, error, refetch } = useJobs(filters);

  const displayedJobs = useMemo(() => {
    if (showingFavorites) {
      return favorites;
    }
    return jobs;
  }, [showingFavorites, favorites, jobs]);

  const handleSearch = (query: string, location: string) => {
    setShowingFavorites(false);
    setFilters((prev) => ({ ...prev, query, location }));
  };

  const handleToggleFavorite = (job: Job) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === job.id)) {
        return prev.filter((f) => f.id !== job.id);
      }
      return [...prev, job];
    });
  };

  const handleShowFavorites = () => {
    setShowingFavorites(!showingFavorites);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        favoritesCount={favorites.length}
        onShowFavorites={handleShowFavorites}
        showingFavorites={showingFavorites}
      />

      <main>
        <SearchHero
          onSearch={handleSearch}
          initialQuery={filters.query}
          initialLocation={filters.location}
        />

        <section className="container pb-16">
          <div className="mx-auto max-w-4xl">
            <JobList
              jobs={displayedJobs}
              isLoading={isLoading && !showingFavorites}
              error={error as Error}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              showingFavorites={showingFavorites}
              onRetry={() => refetch()}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 VagasBrasil. Agregamos vagas de LinkedIn, Glassdoor, Gupy, Catho e mais.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
