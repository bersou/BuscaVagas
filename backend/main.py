import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

# Carrega variáveis de ambiente do .env em desenvolvimento
load_dotenv()

app = FastAPI(
    title="BuscaVagas API",
    description="Backend para agregação de vagas reais via SerpApi"
)

# --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
# Permitir que seu frontend no Netlify acesse este backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, substitua ["*"] por ["https://buscavagas.netlify.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchParams(BaseModel):
    query: str
    location: str

class Job(BaseModel):
    id: str
    title: str
    company: str
    companyLogo: str
    location: str
    type: str
    modality: str
    level: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    benefits: List[str]
    postedAt: str
    source: str
    applicationUrl: str
    isUrgent: bool = False
    isFeatured: bool = False
    isSimplified: bool = False

# Endpoint de saúde para monitoramento da hospedagem
@app.get("/")
async def health_check():
    return {"status": "online", "message": "BuscaVagas API rodando com sucesso!"}

@app.post("/api/search-jobs")
async def search_jobs(params: SearchParams):
    serpapi_key = os.getenv("SERPAPI_KEY")
    if not serpapi_key:
        raise HTTPException(status_code=500, detail="Configuração ausente: SERPAPI_KEY não encontrada.")

    # Lógica de construção da Query
    search_query = params.query.strip()
    if not search_query:
        search_query = f"vagas de emprego {params.location}" if params.location else "vagas de emprego Brasil"
    elif params.location:
        search_query = f"{search_query} {params.location}"

    serp_params = {
        "engine": "google_jobs",
        "q": search_query,
        "hl": "pt-br",
        "gl": "br",
        "api_key": serpapi_key
    }
    
    if params.location:
        serp_params["location"] = params.location

    try:
        response = requests.get("https://serpapi.com/search.json", params=serp_params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        job_results = data.get("jobs_results", [])
        transformed_jobs = []
        
        for index, job in enumerate(job_results):
            desc = job.get("description", "").lower()
            
            # Heurísticas aprimoradas para detalhes da vaga
            job_type = "CLT"
            if any(term in desc for term in ["pj", "pessoa jurídica", "contrato pj"]): job_type = "PJ"
            elif any(term in desc for term in ["estágio", "estagiário", "internship"]): job_type = "Estágio"
            
            modality = "Presencial"
            if any(term in desc for term in ["remoto", "home office", "trabalho remoto", "anywhere"]): modality = "Remoto"
            elif "híbrido" in desc or "hybrid" in desc: modality = "Híbrido"
            
            level = "Pleno"
            if any(term in desc for term in ["júnior", "junior", "jr", "trainee"]): level = "Júnior"
            elif any(term in desc for term in ["sênior", "senior", "sr", "especialista"]): level = "Sênior"

            transformed_jobs.append({
                "id": f"py-{index}-{int(time.time())}",
                "title": job.get("title", "Vaga sem título"),
                "company": job.get("company_name", "Empresa não informada"),
                "companyLogo": job.get("thumbnail") or f"https://ui-avatars.com/api/?name={job.get('company_name', 'E')[:2]}&background=random",
                "location": job.get("location", "Brasil"),
                "type": job_type,
                "modality": modality,
                "level": level,
                "salary": job.get("salary"), # SerpApi às vezes já traz o campo formatado
                "description": job.get("description", ""),
                "requirements": job.get("detected_extensions", {}).get("qualifications", []),
                "benefits": [],
                "postedAt": job.get("detected_extensions", {}).get("posted_at", "Recente"),
                "source": job.get("via", "Google Jobs").replace("via ", ""),
                "applicationUrl": job.get("apply_options", [{}])[0].get("link", "#"),
                "isUrgent": any(term in desc for term in ["urgente", "contratação imediata"]),
                "isFeatured": index < 2,
                "isSimplified": "candidatura simplificada" in desc or "apply now" in desc
            })
            
        return {"jobs": transformed_jobs}
        
    except requests.exceptions.RequestException as e:
        print(f"Erro na SerpApi: {e}")
        raise HTTPException(status_code=502, detail="Erro ao buscar dados na API externa.")
    except Exception as e:
        print(f"Erro interno: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no servidor Python.")

if __name__ == "__main__":
    import uvicorn
    # A porta deve vir da variável de ambiente PORT (exigência do Render/Railway)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
    
