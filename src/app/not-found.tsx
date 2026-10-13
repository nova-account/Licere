import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground mb-6">
          O endereço solicitado não foi encontrado ou foi movido.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

