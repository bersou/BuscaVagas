import { useState } from 'react';
import {
  Heart,
  MapPin,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  Star,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/lib/mockJobs';

interface JobCardProps {
  job: Job;
  isFavorite: boolean;
  onToggleFavorite: (job: Job) => void;
  index: number;
}

export function JobCard({ job, isFavorite, onToggleFavorite, index }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const daysAgo = () => {
    const posted = new Date(job.postedAt);

    // Se a data for inválida (ex: "3 days ago", "Recent"), retorna o texto original ou traduzido
    if (isNaN(posted.getTime())) {
      const text = job.postedAt.toLowerCase();
      if (text.includes('recent') || text.includes('just now')) return 'Agora pouco';
      if (text.includes('today')) return 'Hoje';
      if (text.includes('yesterday')) return 'Ontem';

      // Tradução simples de "X days ago" para "há X dias"
      const match = text.match(/(\d+)\+?\s+days?\s+ago/);
      if (match) return `há ${match[1]} dias`;

      const hourMatch = text.match(/(\d+)\s+hours?\s+ago/);
      if (hourMatch) return `há ${hourMatch[1]} horas`;

      return job.postedAt;
    }

    const now = new Date();
    const diff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 0) return 'Agora pouco';
    return `${diff} dias atrás`;
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'Remoto':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Híbrido':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Presencial':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return '';
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      layout
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
    >
      {/* Featured/Urgent indicators */}
      {(job.isFeatured || job.isUrgent) && (
        <div className="absolute left-0 top-0 flex gap-0">
          {job.isFeatured && (
            <div className="flex items-center gap-1 gradient-hero px-3 py-1 text-xs font-semibold text-primary-foreground rounded-br-lg">
              <Star className="h-3 w-3 fill-current" />
              Destaque
            </div>
          )}
          {job.isUrgent && (
            <div className="flex items-center gap-1 bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground rounded-br-lg">
              <Zap className="h-3 w-3 fill-current" />
              Urgente
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="shrink-0">
            <img
              src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`}
              alt={`Logo ${job.company}`}
              className="h-14 w-14 rounded-xl object-cover ring-2 ring-border"
            />
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{job.company}</span>
                </div>
              </div>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(job)}
                className={`shrink-0 rounded-full p-2 transition-colors ${isFavorite
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-muted text-muted-foreground hover:bg-muted hover:text-red-500'
                  }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            {/* Meta info */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <span className="text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {daysAgo()}
              </div>
              {job.salary && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-sm font-medium text-accent">{job.salary}</span>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {job.type}
              </Badge>
              <Badge variant="outline" className={`text-xs border ${getModalityColor(job.modality)}`}>
                {job.modality}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.level}
              </Badge>
              {job.isSimplified && (
                <Badge className="text-xs gradient-accent text-accent-foreground border-0">
                  <Send className="mr-1 h-3 w-3" />
                  Candidatura Simplificada
                </Badge>
              )}
            </div>

            {/* Source */}
            <div className="mt-3 text-xs text-muted-foreground">
              via <span className="font-medium">{job.source}</span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full justify-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              Ver menos <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Ver detalhes <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                {/* Description */}
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Descrição</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Requisitos</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Benefícios</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-accent/30 text-accent">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  asChild
                  className="w-full gradient-hero text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
                >
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                    Candidatar-se
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
