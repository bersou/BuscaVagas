import { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeroProps {
  onSearch: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

export function SearchHero({ onSearch, initialQuery = '', initialLocation = '' }: SearchHeroProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute left-10 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            +8 fontes de vagas agregadas
          </motion.div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Encontre sua{' '}
            <span className="text-gradient">vaga ideal</span>
            <br />
            em um só lugar
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Agregamos vagas do LinkedIn, Glassdoor, Gupy, Catho e mais.
            <br className="hidden sm:block" />
            Sua próxima oportunidade está aqui.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cargo, empresa ou palavra-chave"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 pl-10 text-base shadow-card"
              />
            </div>

            <div className="relative flex-1 sm:max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cidade ou Estado"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10 text-base shadow-card"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full px-8 gradient-hero text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity sm:w-auto"
              >
                Buscar Vagas
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span>Buscas populares:</span>
            {['React', 'Python', 'Product Manager', 'UX Designer'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  onSearch(term, location);
                }}
                className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
