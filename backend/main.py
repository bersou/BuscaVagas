import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

# Carrega variáveis de ambiente
load_dotenv()

app = FastAPI(
    title="BuscaVagas API",
    description="Backend para agregação de vagas reais via SerpApi"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchParams(BaseModel):
    query: str
    location: str

# Endpoint de saúde
@app.get("/")
async def health_check():
    return {"status": "online", "message": "BuscaVagas API rodando com sucesso!"}

@app.post("/api/search-jobs")
async def search_jobs(params: SearchParams):
    serpapi_key = os.getenv("SERPAPI_KEY")
    if not serpapi_key:
        print("ERRO: SERPAPI_KEY não encontrada nas variáveis de ambiente.")
        raise HTTPException(status_code=500, detail="Configuração de API ausente.")

    # 1. Limpeza e construção inteligente da Query
    query_term = params.query.strip()
    location_term = params.location.strip()
    
    # Se o usuário não digitar nada, definimos um padrão para não vir vazio
    final_query = query_term if query_term else "vagas de emprego"
    
    serp_params = {
        "engine": "google_jobs",
        "q": final_query,
        "hl": "pt-br",
        "gl": "br",
        "api_key": serpapi_key
    }
    
    # 2. Passamos a localização separadamente (melhora muito o resultado no Google Jobs)
    if location_term:
        serp_params["location"] = location_term

    print(f"Iniciando busca real: Termo='{final_query}', Local='{location_term}'")

    try:
        # Aumentamos o timeout para 15s para dar tempo do Google Jobs responder
        response = requests.get("https://serpapi.com/search.json", params=serp_params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        job_results = data.get("jobs_results", [])
        print(f"Sucesso: {len(job_results)} vagas encontradas na SerpApi.")

        transformed_jobs = []
        
        for index, job in enumerate(job_results):
            desc = job.get("description", "").lower()
            
            # Heurísticas simples para preencher campos que a API nem sempre traz
            job_type = "CLT"
            if any(t in desc for t in ["pj", "pessoa jurídica", "mei"]): job_type = "PJ"
            elif any(t in desc for t in ["estágio", "estagiário"]): job_type = "Estágio"
            
            modality = "Presencial"
            if any(t in desc for t in ["remoto", "home office", "trabalho remoto"]): modality = "Remoto"
            elif "híbrido" in desc: modality = "Híbrido"

            transformed_jobs.append({
                "id": f"real-{index}-{int(time.time())}",
                "title": job.get("title", "Vaga sem título"),
                "company": job.get("company_name", "Confidencial"),
                "companyLogo": job.get("thumbnail") or f"https://ui-avatars.com/api/?name={job.get('company_name', 'V')[:2]}&background=random",
                "location": job.get("location", location_term or "Brasil"),
                "type": job_type,
                "modality": modality,
                "level": "Pleno",
                "salary": job.get("salary"),
                "description": job.get("description", ""),
                "requirements": job.get("detected_extensions", {}).get("qualifications", []),
                "benefits": [],
                "postedAt": job.get("detected_extensions", {}).get("posted_at", "Recente"),
                "source": job.get("via", "Google Jobs").replace("via ", ""),
                "applicationUrl": job.get("apply_options", [{}])[0].get("link", "#"),
                "isUrgent": "urgente" in desc,
                "isFeatured": index < 2,
                "isSimplified": "fácil" in desc or "apply now" in desc
            })
            
        return {"jobs": transformed_jobs}
        
    except requests.exceptions.Timeout:
        print("ERRO: A SerpApi demorou muito para responder (Timeout).")
        raise HTTPException(status_code=504, detail="Tempo de busca esgotado.")
    except Exception as e:
        print(f"ERRO CRÍTICO: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar vagas.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
    
