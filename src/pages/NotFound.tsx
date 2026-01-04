import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-destructive/10 p-4 ring-1 ring-destructive/20">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-6xl font-extrabold tracking-tight text-gradient">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Página não encontrada</h2>

        <p className="mb-8 text-muted-foreground leading-relaxed">
          Opa! Parece que o caminho <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{location.pathname}</code> não existe ou foi movido.
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button asChild size="lg" className="gradient-hero text-primary-foreground font-semibold shadow-lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
